# Circuit Breaker — Design Notes

## Problem and boundaries
A state-machine-based resilience primitive with CLOSED, OPEN and HALF_OPEN states, injected clock, bounded probe calls and a separate retry policy.

## Design decisions and FDE / agent considerations
Keep retry and circuit breaking independent. Use monotonic time for cooldowns. In production, coordinate breaker state per dependency/region or accept process-local isolation. For AI integrations, maintain separate breakers per provider/model/operation and combine with token/cost budgets and fallback routing; do not retry non-idempotent tool actions blindly.

## Production evolution
- Define explicit ports for persistence, clocks, external providers and telemetry.
- Add authn/authz, tenant isolation, bounded resource usage and structured audit events.
- Add timeouts, cancellation, retries only for safe/idempotent operations, and dead-letter/replay where relevant.
- Replace process-local state/locks with transactional or distributed primitives before horizontal scaling.
- Instrument latency, error rate, saturation, cost and customer-facing success metrics.

## Guarantees and non-guarantees
The implementation is an interview-sized reference, not a production service. In-memory state is lost on restart and is not shared between workers. Do not describe those properties as durable or globally coordinated.
