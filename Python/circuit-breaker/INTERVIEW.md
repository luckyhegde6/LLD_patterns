# Circuit Breaker — Interview Guide

## 60-second explanation
A state-machine-based resilience primitive with CLOSED, OPEN and HALF_OPEN states, injected clock, bounded probe calls and a separate retry policy.

## Walk through
1. Clarify functional and non-functional requirements.
2. Identify domain entities and invariants.
3. Explain interfaces and why orchestration is separate from adapters.
4. Walk through the happy path, then one failure path.
5. Discuss concurrency, persistence, observability, security and operational ownership.

## Senior / FDE follow-ups
- What customer workflow does this solve and how would you measure adoption and success?
- What integration contracts and failure modes exist at the customer boundary?
- What happens on timeout, duplicate request, partial failure or process restart?
- How do tenant isolation, authorization, data retention and audit work?
- What is the latency/cost budget? How would you degrade gracefully?
- Where can an AI agent assist, and which decisions must remain deterministic or human-approved?

## Trade-offs
Explain the in-memory baseline honestly, then describe the smallest production upgrade and the operational cost it introduces.
