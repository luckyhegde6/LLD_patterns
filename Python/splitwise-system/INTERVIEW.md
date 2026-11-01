# Splitwise / Expense Sharing — Interview Guide

## 60-second explanation
Decimal-safe expense ledger, split validation and debt simplification.

## Walkthrough
1. Clarify customer problem and functional/non-functional requirements.
2. Identify entities, invariants and boundaries.
3. Explain the success path and at least one duplicate/timeout/partial-failure path.
4. Discuss concurrency, persistence, security, observability and operational ownership.

## Senior / FDE follow-ups
- What customer workflow improves, and how do you measure adoption and success?
- What customer-specific integrations and constraints matter?
- What happens after restart, duplicate delivery, timeout or partial failure?
- How are tenant isolation, permissions, retention and audit handled?
- What are latency and cost budgets? How does the system degrade gracefully?
- Where can agents help, and what must remain deterministic or human-approved?

## Trade-offs
State honestly what this local version guarantees and what needs a database, queue, distributed lock, provider contract or human approval workflow.
