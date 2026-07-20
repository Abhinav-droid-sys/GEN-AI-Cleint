# Master Prompt for Recreating the Client Intelligence Dashboard

**Copy and paste the entire prompt below into an AI (like Claude, ChatGPT, or Gemini) to rebuild this exact project from scratch.**

***

**System Instructions / Master Prompt:**

Act as an expert frontend developer and UX designer. I want to build a completely serverless, frontend-only web application called the "Client Intelligence Dashboard". It helps fitness coaches upload client chat logs and uses an LLM to parse them into structured insights. 

Please generate the `index.html`, `style.css`, and `app.js` files to meet the following exhaustive requirements:

### 1. Technology Stack
- Pure HTML, Vanilla CSS, and Vanilla JavaScript. No frontend frameworks (React, Vue, etc.).
- Use CDNs for file parsing: `pdf.js` for PDFs, `mammoth.js` for DOCX, and `xlsx` for Excel sheets.
- Use the **Groq API** (specifically the `llama-3.1-8b-instant` model) via direct REST `fetch` calls in JS.

### 2. UI / UX Design
- **Theme:** Clean, modern, minimalist. Use a soft light-blue/gray palette. Strictly NO emojis anywhere in the UI; use clean vector SVGs (lucide icons) instead.
- **Layout:**
  - A header with a title, subtitle, and a compact toggle switch in the top right corner.
  - An upload section in the center.
  - A dynamic interactive "Legend" section with 4 clickable tags.
  - A responsive CSS Grid for displaying "Insight Cards" below the legend.
- **Animations:** Use smooth CSS transitions. When cards are approved, flash a subtle green gradient background. When rejected, flash a subtle red gradient background.

### 3. Core Features & Logic
- **Mode Toggle:** The toggle switch in the header switches between "Mockup Mode" (default) and "Prototype Mode".
  - *Mockup Mode:* Hides the API input box. Uploading a document instantly loads hardcoded mock JSON data.
  - *Prototype Mode:* Shows a connection box asking for a "Groq API Key". Once the user enters the key and hits "Connect", show a loading spinner, save the key to `localStorage`, fade out and completely hide the connection box, and reveal the file upload section. Add a small "Disconnect API" button next to the header toggle.
- **File Parsing:** When a file is uploaded, extract the raw text using the respective CDN library.
- **Batch AI Generation:** Pass the extracted text to the Groq API. You MUST prompt the LLM to return exactly a JSON array containing 11 specific objects. The 11 categories are: 
  *Weekly client summary, Nutrition adherence, Exercise / steps, Sleep, Water intake, Symptoms / stress, Engagement level, Key barriers, Pending actions, Risk / attention flags, Recommended next action for the coach*.
- **The JSON Schema:**
  Each object in the array must strictly have these 4 keys:
  - `title`: The category name.
  - `value`: The detailed analysis.
  - `type`: Must exactly match one of these 4 strings: "Confirmed facts", "Client-reported information", "AI-generated inference", "Missing / unavailable information".
  - `evidence`: Exact quotes from the text.

### 4. Interactive Insight Cards
- Render each returned JSON object as a card.
- **Filtering:** Clicking a tag in the Legend should filter the cards on the screen to only show cards matching that specific `type`.
- **Card Actions:** Every card must have an "Approve" (Checkmark icon) and "Reject" (Cross icon) button.
  - *Approve:* Flashes the card green.
  - *Reject:* Flashes the card red, hides the content, and reveals a "Feedback Box" inside the card with a text input and a "Submit to AI" button.
- **Granular Regeneration:** When the user types feedback and hits Submit, make a *secondary* fetch call to Groq. Send the original document text, the category title, and the user's feedback. Instruct the LLM to return a single JSON object (same schema) regenerating *only* that specific card based strictly on the feedback. Replace the card data with the new response and flash it green.

### 5. Prompt Engineering constraints
- You must write incredibly strict system prompts inside the `app.js` fetch calls.
- Because we are using a smaller model (`llama-3.1-8b-instant`), you must explicitly define the 4 flags in the prompt:
  - 'Confirmed facts' = objective events that definitely happened.
  - 'Client-reported information' = subjective feelings, symptoms, or claims.
  - 'AI-generated inference' = deductions not explicitly said.
  - 'Missing / unavailable information' = topics totally absent from the chat.
- Use regex in JS to strip markdown formatting (` ```json `) from the LLM response before parsing it with `JSON.parse()`.

Please provide all the code (HTML, CSS, JS) necessary to make this completely functional out of the box.
