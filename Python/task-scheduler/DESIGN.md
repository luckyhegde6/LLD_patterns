# Task Scheduler — Design Notes

## Problem
Task lifecycle with due-time execution, retry/backoff and idempotency.

## AI-agent / FDE considerations
Use durable lease claims and checkpoints in production. Agent tool actions need action-level idempotency and explicit approval-wait states.

## Production evolution
- Keep core domain logic framework-agnostic; put DB, HTTP, queue and provider integrations behind adapters.
- Add authentication, authorization, tenant isolation, validation, auditability and resource budgets.
- Treat external responses and model output as untrusted data.
- Add deadlines, cancellation, backpressure and retries only where idempotency makes retries safe.
- Replace process-local memory and locks with durable transactions/shared coordination before horizontal scaling.
- Measure customer outcomes, adoption, latency, reliability, saturation and cost.

## Guarantees and limitations
This package is an interview-sized deterministic baseline. In-memory state is lost on restart and is not shared across processes. Distributed correctness requires production adapters, operational controls and failure testing.
