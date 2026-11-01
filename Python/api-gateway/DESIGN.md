# API Gateway — Design Notes

## Problem and boundaries
A framework-agnostic gateway pipeline for authentication, authorization, routing, per-tenant quotas, backend selection, and structured observability.

## Design decisions and FDE / agent considerations
Compose middleware in a deterministic order. Keep routing separate from policy. Model identity and tenant context explicitly. Agent/MCP traffic must use tool allowlists, request schema validation, per-tool scopes, prompt-injection-aware input handling, timeouts, payload limits, tenant budgets, and audit events. The gateway must never treat an LLM-produced tool name or arguments as trusted.

## Production evolution
- Define explicit ports for persistence, clocks, external providers and telemetry.
- Add authn/authz, tenant isolation, bounded resource usage and structured audit events.
- Add timeouts, cancellation, retries only for safe/idempotent operations, and dead-letter/replay where relevant.
- Replace process-local state/locks with transactional or distributed primitives before horizontal scaling.
- Instrument latency, error rate, saturation, cost and customer-facing success metrics.

## Guarantees and non-guarantees
The implementation is an interview-sized reference, not a production service. In-memory state is lost on restart and is not shared between workers. Do not describe those properties as durable or globally coordinated.
