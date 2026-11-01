# Payment Processing — Design Notes

## Problem
Payment intent lifecycle, provider adapter, webhook boundary and idempotency.

## AI-agent / FDE considerations
Never store card data. Verify webhook signatures; handle duplicates and reordering. Agent payments/refunds require explicit authorization and approval.

## Production evolution
- Keep core domain logic framework-agnostic; put DB, HTTP, queue and provider integrations behind adapters.
- Add authentication, authorization, tenant isolation, validation, auditability and resource budgets.
- Treat external responses and model output as untrusted data.
- Add deadlines, cancellation, backpressure and retries only where idempotency makes retries safe.
- Replace process-local memory and locks with durable transactions/shared coordination before horizontal scaling.
- Measure customer outcomes, adoption, latency, reliability, saturation and cost.

## Guarantees and limitations
This package is an interview-sized deterministic baseline. In-memory state is lost on restart and is not shared across processes. Distributed correctness requires production adapters, operational controls and failure testing.
