# 2. Structured Output / JSON Schema

The system relies on a strict, flat JSON array format representing individual insight cards. 

```json
[
  {
    "title": "Nutrition adherence",
    "value": "The client successfully stuck to their macro targets on weekdays but struggled over the weekend due to a social event. They ate an extra 500 calories of pizza.",
    "type": "Client-reported information",
    "evidence": "\"I did great Mon-Fri but lost control at the birthday party on Saturday and ate a ton of pizza.\""
  },
  {
    "title": "Water intake",
    "value": "There is no mention of how much water the client drank this week. Having this data would help determine if their reported headaches are related to dehydration or diet.",
    "type": "Missing / unavailable information",
    "evidence": ""
  }
]
```
