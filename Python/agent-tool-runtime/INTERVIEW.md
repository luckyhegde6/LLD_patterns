# Agent Tool Runtime — Interview Guide

## 30-second explanation
The model proposes a tool call, but it does not execute arbitrary code. A runtime resolves the tool from an allowlist, validates its arguments, checks policy, executes within a timeout, normalizes the result, and writes an audit record. This separates probabilistic planning from deterministic, governed execution.

## Key trade-offs
- Allowlist vs dynamic discovery: safer predictable surface vs flexibility.
- Synchronous thread timeout vs async cancellation/process isolation.
- Strict schema validation vs evolving tool contracts.
- Human approval vs automation speed for consequential actions.

## Senior/FDE follow-ups
- How do you prevent prompt injection from escalating tool permissions?
- How do you scope permissions per user, tenant, and workflow?
- How do you guarantee idempotency for a payment or ticket-booking tool?
- How do you trace a tool call across MCP, API gateway, and downstream service?
- What metrics define customer value, not just model quality?
- How would you roll out safely and collect user feedback?
