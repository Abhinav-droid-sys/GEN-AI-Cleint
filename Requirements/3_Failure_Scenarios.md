# 3. Three Possible Hallucination or Failure Scenarios

1. **Schema Non-Compliance (JSON Breakage):** 
   - *Failure:* Despite strict prompting, smaller models (like Llama 3 8B) may sometimes wrap the requested JSON output in markdown formatting (e.g., ````json ... ````) or conversational filler ("Here is your data:"). 
   - *Mitigation:* The dashboard includes resilient RegEx parsing (`raw.replace(/```json/g, '').replace(/```/g, '')`) to strip markdown blocks and attempt to salvage the JSON object.
2. **Flag Misclassification Bias:** 
   - *Failure:* The model might struggle to distinguish between nuanced states, such as flagging everything as "AI-generated inference" rather than acknowledging objective "Confirmed facts". 
   - *Mitigation:* We implemented highly strict prompt definitions (e.g., explicitly defining "Confirmed facts" as *objective events that definitively happened*) to constrain the model's subjective leeway.
3. **Evidence Fabrication (True Hallucination):** 
   - *Failure:* When pushed to fill out a category (e.g., "Sleep") that isn't heavily detailed in the chat, the LLM might hallucinate a quote for the `evidence` field to justify its analysis.
   - *Mitigation:* The prompt strictly demands the use of the `Missing / unavailable information` flag when data is absent, and forces the model to explain *why* that data is needed rather than guessing it.
