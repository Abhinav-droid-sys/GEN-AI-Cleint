document.addEventListener('DOMContentLoaded', () => {
    const $ = id => document.getElementById(id);
    const analyzeBtn = $('analyze-btn');
    const loader = $('loader');
    const dashboard = $('dashboard');
    const resultsGrid = $('results-grid');
    const template = $('insight-card-template');
    const fileUpload = $('file-upload');
    const fileNameDisplay = $('file-name');
    const chatInput = $('chat-input');
    const toastContainer = $('toast-container');
    const apiKeyInput = $('api-key-input');
    const saveApiKeyBtn = $('save-api-key');
    const apiSetupBox = $('api-setup-box');
    const modeToggle = $('mode-toggle');
    const labelMockup = $('label-mockup');
    const labelPrototype = $('label-prototype');
    const uploadSection = $('upload-section');
    const apiLoader = $('api-loader');
    const apiSuccessMsg = $('api-success-msg');
    const headerDisconnectBtn = $('header-disconnect-btn');

    let GROQ_API_KEY = localStorage.getItem('GROQ_API_KEY') || "";

    const updateUIState = () => {
        const isPrototype = modeToggle.checked;
        
        if (!isPrototype) {
            // Mockup Mode
            labelMockup.classList.add('active');
            labelPrototype.classList.remove('active');
            apiSetupBox.classList.add('hidden');
            apiSetupBox.classList.remove('fade-out');
            uploadSection.classList.remove('hidden');
            headerDisconnectBtn.classList.add('hidden');
        } else {
            // Prototype Mode
            labelMockup.classList.remove('active');
            labelPrototype.classList.add('active');
            
            if (GROQ_API_KEY) {
                // Key already provided
                uploadSection.classList.remove('hidden');
                
                if (!apiSetupBox.classList.contains('hidden')) {
                    apiSuccessMsg.classList.remove('hidden');
                    apiKeyInput.parentElement.classList.add('hidden');
                    apiSetupBox.classList.add('fade-out');
                    setTimeout(() => {
                        apiSetupBox.classList.add('hidden');
                    }, 500);
                }
                
                headerDisconnectBtn.classList.remove('hidden');
            } else {
                // Needs key
                apiSetupBox.classList.remove('hidden');
                apiSetupBox.classList.remove('fade-out');
                uploadSection.classList.add('hidden');
                apiSuccessMsg.classList.add('hidden');
                apiKeyInput.parentElement.classList.remove('hidden');
                headerDisconnectBtn.classList.add('hidden');
            }
        }
    };

    // Initial State
    modeToggle.checked = false; // Default to Mockup
    updateUIState();

    modeToggle.addEventListener('change', updateUIState);

    saveApiKeyBtn.addEventListener('click', () => {
        const key = apiKeyInput.value.trim();
        if (key) {
            saveApiKeyBtn.disabled = true;
            apiLoader.classList.remove('hidden');
            
            // Simulate backend attachment delay
            setTimeout(() => {
                GROQ_API_KEY = key;
                localStorage.setItem('GROQ_API_KEY', key);
                
                apiLoader.classList.add('hidden');
                saveApiKeyBtn.disabled = false;
                
                showToast('API Key successfully connected to backend!', 'success');
                updateUIState();
            }, 1800);
        }
    });

    headerDisconnectBtn.addEventListener('click', () => {
        GROQ_API_KEY = "";
        localStorage.removeItem('GROQ_API_KEY');
        apiKeyInput.value = "";
        showToast('API Key disconnected', 'success');
        updateUIState();
    });

    if (window['pdfjs-dist/build/pdf']) {
        window.pdfjsLib = window['pdfjs-dist/build/pdf'];
        pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
    }

    const parseDOCX = async file => {
        const arrayBuffer = await file.arrayBuffer();
        const result = await mammoth.extractRawText({ arrayBuffer });
        return result.value;
    };

    const parseXLSX = async file => {
        const arrayBuffer = await file.arrayBuffer();
        const workbook = XLSX.read(arrayBuffer, { type: 'array' });
        let text = "";
        workbook.SheetNames.forEach(sheetName => {
            text += XLSX.utils.sheet_to_txt(workbook.Sheets[sheetName]) + "\n";
        });
        return text;
    };

    const parsePDF = async file => {
        const arrayBuffer = await file.arrayBuffer();
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
            const page = await pdf.getPage(i);
            const content = await page.getTextContent();
            text += content.items.map(item => item.str).join(" ") + "\n";
        }
        return text;
    };

    fileUpload.addEventListener('change', async e => {
        const file = e.target.files[0];
        if (!file) {
            fileNameDisplay.textContent = '';
            return;
        }

        fileNameDisplay.textContent = `Extracting ${file.name}...`;
        analyzeBtn.disabled = true;

        try {
            let extractedText = "";
            const ext = file.name.split('.').pop().toLowerCase();
            
            if (ext === 'docx') extractedText = await parseDOCX(file);
            else if (ext === 'xlsx') extractedText = await parseXLSX(file);
            else if (ext === 'pdf') extractedText = await parsePDF(file);
            else throw new Error("Unsupported format");

            chatInput.value = extractedText;
            fileNameDisplay.textContent = file.name;
        } catch (err) {
            alert("Error parsing file: " + err.message);
            fileNameDisplay.textContent = "Extraction failed";
        } finally {
            analyzeBtn.disabled = false;
        }
    });

    const checkIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"></polyline></svg>`;
    const crossIcon = `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`;

    const showToast = (message, type = 'success') => {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = (type === 'success' ? checkIcon : crossIcon) + message;
        toastContainer.appendChild(toast);
        setTimeout(() => toast.remove(), 3500);
    };

    const getTagClass = type => {
        if (!type) return 'tag-inference';
        if (type.includes('Confirmed')) return 'tag-confirmed';
        if (type.includes('Client-reported')) return 'tag-client';
        if (type.includes('Missing')) return 'tag-missing';
        return 'tag-inference';
    };

    const callGeminiSingle = async (categoryTitle, feedback, originalText) => {
        if (!GROQ_API_KEY) {
            // Mock offline behavior
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve({
                        title: categoryTitle,
                        value: `[MOCKUP REGENERATION] Feedback applied: "${feedback}"`,
                        type: "AI-generated inference",
                        evidence: "Mock evidence generated offline."
                    });
                }, 1000);
            });
        }

        const prompt = `You are regenerating a single insight card for the category: "${categoryTitle}".
The user rejected your previous analysis and provided this specific requirement/feedback: "${feedback}"

You MUST completely regenerate this card, STRICTLY following the user's feedback above. 

Return ONLY a single JSON object matching this schema:
{
  "title": "${categoryTitle}",
  "value": "Your highly detailed analysis that MUST address and incorporate the user's feedback: ${feedback}",
  "type": "You MUST classify the insight into exactly ONE of these four flags (Match the exact string): 'Confirmed facts' (objective events that definitely happened), 'Client-reported information' (subjective feelings, symptoms, or claims made by the client), 'AI-generated inference' (your own recommendations or deductions not explicitly said by the client), or 'Missing / unavailable information' (if the topic is not mentioned).",
  "evidence": "Exact supporting quote(s) from the uploaded chat"
}

Chat:
${originalText}`;

        const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }],
                response_format: { type: "json_object" }
            })
        });

        if (!res.ok) throw new Error("API request failed");
        
        const data = await res.json();
        const raw = data.choices[0].message.content;
        return JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
    };

    const createCard = data => {
        const clone = template.content.cloneNode(true);
        const card = clone.querySelector('.card');
        const tag = card.querySelector('.card-tag');
        const contentWrapper = card.querySelector('.card-content-wrapper');
        const feedbackBox = card.querySelector('.feedback-box');
        
        const updateCardData = (newData) => {
            card.querySelector('.card-title').textContent = newData.title || "Insight";
            card.querySelector('.card-value').textContent = newData.value || "";
            card.querySelector('.card-evidence').textContent = newData.evidence ? `"${newData.evidence}"` : "";
            tag.textContent = newData.type || "AI Inference";
            tag.className = 'card-tag tag ' + getTagClass(newData.type);
        };
        updateCardData(data);

        card.querySelector('.btn-approve').addEventListener('click', () => {
            card.classList.remove('rejected-state');
            card.classList.add('approved-state');
            showToast('Data is correctly stored', 'success');
        });

        card.querySelector('.btn-reject').addEventListener('click', () => {
            card.classList.remove('approved-state');
            card.classList.add('rejected-state');
            setTimeout(() => {
                contentWrapper.classList.add('hidden');
                feedbackBox.classList.remove('hidden');
            }, 500);
        });
        
        card.querySelector('.btn-edit').addEventListener('click', () => {
            const val = prompt("Edit:", card.querySelector('.card-value').textContent);
            if (val) {
                card.querySelector('.card-value').textContent = val;
                tag.textContent = "Human Edited";
                tag.className = 'card-tag tag tag-confirmed';
            }
        });

        card.querySelector('.btn-cancel-feedback').addEventListener('click', () => {
            feedbackBox.classList.add('hidden');
            contentWrapper.classList.remove('hidden');
            card.classList.remove('rejected-state');
        });

        card.querySelector('.btn-submit-feedback').addEventListener('click', async () => {
            const feedbackText = card.querySelector('.feedback-input').value.trim();
            if(!feedbackText) return alert("Please enter feedback for regeneration.");

            const feedbackLoader = card.querySelector('.feedback-loader');
            const submitBtn = card.querySelector('.btn-submit-feedback');
            
            submitBtn.disabled = true;
            feedbackLoader.classList.remove('hidden');

            try {
                const originalText = chatInput.value.trim();
                const newInsight = await callGeminiSingle(data.title, feedbackText, originalText);
                updateCardData(newInsight);
                
                feedbackBox.classList.add('hidden');
                contentWrapper.classList.remove('hidden');
                card.classList.remove('rejected-state');
                card.classList.add('approved-state');
                card.querySelector('.feedback-input').value = '';
                showToast('Card regenerated successfully', 'success');
            } catch (err) {
                alert("Failed to regenerate: " + err.message);
            } finally {
                submitBtn.disabled = false;
                feedbackLoader.classList.add('hidden');
            }
        });

        return card;
    };

    const callGemini = async text => {
        const isPrototype = modeToggle.checked;
        if (!isPrototype || !GROQ_API_KEY) {
            // Mock offline behavior
            return new Promise(resolve => {
                setTimeout(() => resolve(mockData), 1500);
            });
        }

        const prompt = `Analyze this coaching chat in high detail. You MUST return exactly a JSON array of objects, providing a detailed review for EVERY SINGLE ONE of these required categories:
1. Weekly client summary
2. Nutrition adherence
3. Exercise / steps
4. Sleep
5. Water intake
6. Symptoms / stress
7. Engagement level
8. Key barriers
9. Pending actions
10. Risk / attention flags
11. Recommended next action for the coach

Schema per object:
{
  "title": "Exact Category Name from the list above",
  "value": "A highly detailed, comprehensive review/analysis for this category. If you use the 'Missing / unavailable information' flag, you MUST explicitly state exactly what data is missing and explain how having that data would help improve the fitness and wellness suggestions for the client.",
  "type": "You MUST classify the insight into exactly ONE of these four flags (Match the exact string): 'Confirmed facts' (objective events that definitely happened), 'Client-reported information' (subjective feelings, symptoms, or claims made by the client), 'AI-generated inference' (your own recommendations or deductions not explicitly said by the client), or 'Missing / unavailable information' (if the topic is not mentioned).",
  "evidence": "You MUST explicitly mention where you got this idea from by providing the exact supporting quote(s) from the uploaded chat."
}

Return ONLY a valid JSON array. No markdown formatting or code blocks.

Chat:
${text}`;

        const res = await fetch(`https://api.groq.com/openai/v1/chat/completions`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${GROQ_API_KEY}`
            },
            body: JSON.stringify({
                model: "llama-3.1-8b-instant",
                messages: [{ role: "user", content: prompt }]
            })
        });

        if (!res.ok) {
            const errText = await res.text();
            console.error("API Error Response:", errText);
            throw new Error(`API request failed with status ${res.status}. See console for details.`);
        }
        
        const data = await res.json();
        const raw = data.choices[0].message.content;
        
        // Sometimes LLama might still wrap in markdown or an object if prompted poorly
        let parsed;
        try {
            parsed = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
        } catch(e) {
            const json = JSON.parse(raw.replace(/```json/g, '').replace(/```/g, '').trim());
            parsed = json.insights || json;
        }
        return parsed;
    };

    analyzeBtn.addEventListener('click', async () => {
        const text = chatInput.value.trim();
        if (!text) return alert("Enter conversation text first.");

        analyzeBtn.disabled = true;
        loader.classList.remove('hidden');
        dashboard.classList.add('hidden');
        
        const legendContainer = document.querySelector('.legend');
        document.querySelectorAll('.legend .tag').forEach(t => t.classList.remove('active-filter'));
        legendContainer.classList.remove('filtering');

        try {
            const insights = await callGemini(text);
            resultsGrid.innerHTML = '';
            
            insights.forEach((item, i) => {
                const card = createCard(item);
                card.style.animation = `fadeIn 0.4s ease forwards ${i * 0.05}s`;
                card.style.opacity = '0';
                resultsGrid.appendChild(card);
            });

            dashboard.classList.remove('hidden');
            dashboard.scrollIntoView({ behavior: 'smooth' });
            
            const isPrototype = modeToggle.checked;
            if (!isPrototype) {
                showToast('Displaying mock data (Offline Mode)', 'success');
            }
        } catch (err) {
            alert("Error analyzing: " + err.message);
            console.error(err);
        } finally {
            loader.classList.add('hidden');
            analyzeBtn.disabled = false;
        }
    });

    // Filtering Logic
    const legendTags = document.querySelectorAll('.legend .tag');
    const legendContainer = document.querySelector('.legend');
    
    legendTags.forEach(tag => {
        tag.addEventListener('click', () => {
            const filterClass = tag.getAttribute('data-filter');
            const isActive = tag.classList.contains('active-filter');
            
            legendTags.forEach(t => t.classList.remove('active-filter'));
            legendContainer.classList.remove('filtering');
            document.querySelectorAll('.card').forEach(c => c.classList.remove('filtered-out'));

            if (!isActive) {
                tag.classList.add('active-filter');
                legendContainer.classList.add('filtering');
                
                document.querySelectorAll('.card').forEach(c => {
                    const cardTag = c.querySelector('.card-tag');
                    if (!cardTag.classList.contains(filterClass)) {
                        c.classList.add('filtered-out');
                    }
                });
            }
        });
    });
});
