# Python LLD Patterns — Agentic Systems & FDE Track

Python implementations complement the existing `Typescript/` solutions. Mirror each TypeScript problem's requirements, component boundaries, design notes, and tests before translating syntax; use idiomatic Python (Protocols/ABC, dataclasses, enums, dependency injection, pytest).

## Design bar
- Keep domain logic framework-agnostic; integrations (HTTP, DB, model provider, MCP) are adapters.
- Treat model output as untrusted input. Enforce schemas, authorization, budgets, timeouts, idempotency, auditability, and human approval for consequential actions.
- Distinguish local-demo behavior from production/distributed guarantees.
- Test failure paths, not just happy paths.

## Structure
Each problem follows the TypeScript layout: README, OVERVIEW or DESIGN, INTERVIEW, src, tests; add whiteboard and beginner explanations when useful.

## Setup
```bash
python -m venv .venv
# Windows: .venv\\Scripts\\activate
# macOS/Linux: source .venv/bin/activate
pip install -r Python/requirements-dev.txt
python -m pytest Python -v
```

## FDE-oriented sequence
1. Cache system — policy/store separation, TTL, LRU/LFU, read-through.
2. Rate limiter — protect model/tool APIs, tenant quotas, token budgets.
3. Agent Tool Runtime — allowlisted tools, validated arguments, policy checks, timeouts, audit.
4. Task scheduler — durable jobs, retries, idempotency, distributed claims.
5. API gateway — auth, routing, quotas, observability, model/tool endpoints.
6. Circuit breaker — protect flaky model providers and external APIs.
7. RAG ingestion — chunking, embedding adapter, retrieval interfaces, freshness.
8. Agent workflow orchestrator — state, checkpoints, approval gates, resumability.
9. Notification system — human-in-the-loop approvals and delivery.
10. Ticket booking / payment / parking lot — transactions and concurrency.

## FDE interview lens
For every project explain customer problem and success metric; requirements and constraints; integration surface; failure modes; security/privacy; latency/cost; rollout and observability; adoption feedback; trade-offs; and production operations.
