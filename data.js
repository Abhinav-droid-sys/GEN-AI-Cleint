const mockData = [
    {
        title: "Weekly client summary",
        value: "The client had a stressful and hectic week, balancing school commitments, office politics, and family. Sleep improved towards the end of the week, as did overall energy, though acidity and bloating remain persistent issues.",
        type: "AI-generated inference",
        evidence: "There is a lot of office pressure and politics going on... overall energy is much better than before."
    },
    {
        title: "Nutrition adherence",
        value: "Inconsistent. Missed protein some days and skipped meals due to schedule. Client admits to not having enough time for meal planning.",
        type: "Client-reported information",
        evidence: "Didn't eat much in the evening. Just a small piece of paneer."
    },
    {
        title: "Exercise / steps",
        value: "Averaging 6,000 - 8,000 steps. Includes stretching, running, and household chores like sweeping and mopping.",
        type: "Client-reported information",
        evidence: "Steps around 8,000, Exercise only walking... Did mopping and sweeping"
    },
    {
        title: "Sleep",
        value: "Variable. Started at a low 5 hours, but significantly improved to 8 hours by Day 8.",
        type: "Client-reported information",
        evidence: "Slept only around 5 hours last night... Slept better last night, around 8 hours."
    },
    {
        title: "Water intake",
        value: "The client is consistently achieving 3.5 to 4 litres on tracked days.",
        type: "Client-reported information",
        evidence: "Water 4 litres... Water around 3.5 litres."
    },
    {
        title: "Symptoms / stress",
        value: "Persistent acidity, bloating. High stress leading to severe fatigue, to the point of sleeping during a meeting.",
        type: "Confirmed facts",
        evidence: "Got up with acidity... head went down on the table and I actually slept for a few seconds."
    },
    {
        title: "Engagement level",
        value: "High engagement. The client reports daily and is completely honest about missing habits or failing to stick to the routine.",
        type: "AI-generated inference",
        evidence: "Forgot ACV today. Not yet in the habit."
    },
    {
        title: "Key barriers",
        value: "Lack of time for meal prep, hectic school schedule, and significant office stress causing disruptions.",
        type: "Confirmed facts",
        evidence: "I am not getting enough time to plan meals. Next week should be easier."
    },
    {
        title: "Pending actions",
        value: "Stocking vegetables properly, setting an ACV reminder.",
        type: "Confirmed facts",
        evidence: "I still need to stock vegetables properly... Set a reminder around meal timings."
    },
    {
        title: "Risk / attention flags",
        value: "Extreme workplace fatigue/burnout. Client fell asleep during a meeting.",
        type: "AI-generated inference",
        evidence: "During a meeting today I was so tired that my head went down on the table..."
    },
    {
        title: "Recommended next action for the coach",
        value: "Prioritize stress management strategies, investigate the root cause of bloating/acidity (potentially diet-related given the stress), and adjust the routine around the upcoming school schedule.",
        type: "AI-generated inference",
        evidence: "Based on Day 7 stress event and ongoing acidity since Day 1."
    }
];
