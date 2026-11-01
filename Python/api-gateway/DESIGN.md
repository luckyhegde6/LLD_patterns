# API Gateway — Design Notes

## Problem
Composable gateway middleware for authentication, routing and observability.

## AI-agent / FDE considerations
For agent and MCP traffic enforce tool allowlists, schema validation, tenant scopes, payload limits, timeouts, budgets and audit. Model output is untrusted; never authorize a tool because the model requested it.

## Production evolution
- Keep core domain logic framework-agnostic; put DB, HTTP, queue and provider integrations behind adapters.
- Add authentication, authorization, tenant isolation, validation, auditability and resource budgets.
- Treat external responses and model output as untrusted data.
- Add deadlines, cancellation, backpressure and retries only where idempotency makes retries safe.
- Replace process-local memory and locks with durable transactions/shared coordination before horizontal scaling.
- Measure customer outcomes, adoption, latency, reliability, saturation and cost.

## Guarantees and limitations
This package is an interview-sized deterministic baseline. In-memory state is lost on restart and is not shared across processes. Distributed correctness requires production adapters, operational controls and failure testing.
