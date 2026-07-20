# 1. Prompt / Workflow Used to Analyze the Conversation

### Workflow Architecture
1. **Document Ingestion:** The user uploads a file (`.docx`, `.xlsx`, `.pdf`). The dashboard uses libraries (pdf.js, mammoth.js, xlsx.js) to extract raw text entirely client-side.
2. **API Injection (Prototype Mode):** The user provides their Groq API Key, which is temporarily saved in LocalStorage and attached directly to API requests, meaning no backend server is required.
3. **Primary Analysis (Batch Request):** The extracted text is injected into the primary system prompt and sent to the Groq API (`llama-3.1-8b-instant`) to generate 11 specific insight categories.
4. **Regeneration (Granular Request):** If the user is dissatisfied with a specific card, they click the "Cross" icon, provide text feedback, and the system sends a secondary, highly targeted prompt to regenerate *only* that specific card while retaining context of the original chat.

### Primary Prompt
```text
Analyze this coaching chat in high detail. You MUST return exactly a JSON array of objects, providing a detailed review for EVERY SINGLE ONE of these required categories:
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
[EXTRACTED_CHAT_TEXT_HERE]
```

### Regeneration Prompt (Per Card)
```text
You are regenerating a single insight card for the category: "[CATEGORY_TITLE]".
The user rejected your previous analysis and provided this specific requirement/feedback: "[USER_FEEDBACK]"

You MUST completely regenerate this card, STRICTLY following the user's feedback above. 

Return ONLY a single JSON object matching this schema:
{
  "title": "[CATEGORY_TITLE]",
  "value": "Your highly detailed analysis that MUST address and incorporate the user's feedback: [USER_FEEDBACK]",
  "type": "You MUST classify the insight into exactly ONE of these four flags (Match the exact string): 'Confirmed facts' (objective events that definitely happened), 'Client-reported information' (subjective feelings, symptoms, or claims made by the client), 'AI-generated inference' (your own recommendations or deductions not explicitly said by the client), or 'Missing / unavailable information' (if the topic is not mentioned).",
  "evidence": "Exact supporting quote(s) from the uploaded chat"
}

Chat:
[EXTRACTED_CHAT_TEXT_HERE]
```
