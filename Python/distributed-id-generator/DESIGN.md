# Distributed ID Generator — Design Notes

## Problem and boundaries
A Snowflake-style 64-bit, time-ordered ID generator with configurable epoch, node identity, sequence bits and clock rollback protection.

## Design decisions and FDE / agent considerations
Uniqueness depends on globally unique node IDs and controlled clock behavior. In real deployments lease node IDs (or use worker identity from a trusted control plane), monitor clock drift, and persist configuration. For event-driven agents, use generated IDs for trace/correlation and idempotency keys—but do not confuse sortable IDs with authorization secrets.

## Production evolution
- Define explicit ports for persistence, clocks, external providers and telemetry.
- Add authn/authz, tenant isolation, bounded resource usage and structured audit events.
- Add timeouts, cancellation, retries only for safe/idempotent operations, and dead-letter/replay where relevant.
- Replace process-local state/locks with transactional or distributed primitives before horizontal scaling.
- Instrument latency, error rate, saturation, cost and customer-facing success metrics.

## Guarantees and non-guarantees
The implementation is an interview-sized reference, not a production service. In-memory state is lost on restart and is not shared between workers. Do not describe those properties as durable or globally coordinated.
