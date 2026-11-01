# Agent Tool Runtime — Design

Registry → JSON-schema subset validation → authorization → bounded execution/retries → normalized result → audit.

- ToolSpec declares stable name, description, input schema, permissions, timeout and max attempts.
- Registry is an explicit allowlist.
- Policy is checked before handler execution.
- Schema subset: type, enum, required, properties, items, additionalProperties.
- Each attempt produces an audit record; retry only idempotent operations.
- Promise timeout bounds waiting but does not cancel arbitrary underlying work.
- Production needs trusted identity, tenant scopes, durable audit, secret redaction and sandboxing.
