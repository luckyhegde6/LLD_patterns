# Elevator System — Interview Guide

## 30s Pitch
“I model the elevator as a state machine, use a scheduler with directional queues, and a controller to orchestrate movement.”

---

## Interruptions

Interviewer: Why state machine?
You: Prevents invalid transitions and simplifies reasoning.

Interviewer: Starvation?
You: Directional queues can starve; add aging or round-robin.

Interviewer: Multiple elevators?
You: Add dispatcher assigning requests by proximity.

Interviewer: Hardest part?
You: Balancing fairness vs throughput.
