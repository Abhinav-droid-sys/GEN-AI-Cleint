# Client Intelligence Dashboard

A serverless, frontend-only web application designed for fitness coaches. This dashboard allows coaches to upload unstructured client chat logs (PDFs, Word Documents, Excel sheets) and uses the **Groq API** (powered by `llama-3.1-8b-instant`) to instantly parse the conversations into highly structured, actionable insights.

## Features

- **Local File Parsing:** Uses CDN libraries (`pdf.js`, `mammoth.js`, `xlsx.js`) to extract raw text from documents entirely on the client side, ensuring no files are uploaded to random third-party servers.
- **Batch AI Generation:** Automatically categorizes the chat into 11 critical coaching metrics (e.g., Nutrition Adherence, Sleep, Symptoms, Key Barriers).
- **Strict Data Flagging:** Every insight is strictly classified into one of four flags to prevent AI hallucination:
  - Confirmed facts
  - Client-reported information
  - AI-generated inference
  - Missing / unavailable information
- **Granular Regeneration:** If you disagree with the AI's analysis on a specific card, you can reject it, type your feedback, and the system will make a targeted API call to regenerate *only* that specific card without reprocessing the entire document.
- **Interactive Legend:** Click the tags in the top legend to instantly filter the dashboard by data type.
- **Shareable Prototype Mode:** Contains an isolated `Mockup` section with an interactive UI toggle. Users can test the UI offline using Mockup Mode, or connect their own Groq API key via a sleek connection interface to run it live.

## File Structure

- `/index.html` - The main dashboard UI.
- `/style.css` - Custom styling featuring CSS Grid, glassmorphism, and minimal animations.
- `/app.js` - The core logic handling file parsing, API fetching, UI state, and regex-based JSON extraction.

## Getting Started

Because this is a serverless frontend application, there is no build step required.

1. Clone or download the repository.
2. Ensure you have your Groq API key embedded in `app.js` (for the main project).
3. Double-click `index.html` to open it in any modern web browser.
4. Upload a sample `.pdf`, `.docx`, or `.xlsx` chat log to see the dashboard populate.

## Technology Stack

- Pure HTML / CSS / Vanilla JavaScript
- [Groq API](https://console.groq.com/)
- [Llama 3.1 8B](https://groq.com/llama-3-1/)
- pdf.js, mammoth.js, SheetJS (xlsx)
