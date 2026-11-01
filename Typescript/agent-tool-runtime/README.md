# Agent Tool Runtime (TypeScript)

Allowlisted tool registry, JSON-schema subset validation, permission policy, bounded retries/timeouts and audit records. Handlers are injected; model output is treated as untrusted input.

Run repository tests with `npm test -- --runInBand`. This reference implementation is not a sandbox; production requires durable audit, tenant-scoped policy, cancellation and isolation for untrusted tools.
