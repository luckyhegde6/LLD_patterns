# Agent Tool Runtime — Design

## Requirements
- Register tools explicitly by stable name.
- Validate tool arguments before invoking handlers.
- Reject unknown tools and malformed arguments.
- Apply a policy decision before execution.
- Bound execution time and return structured errors.
- Produce an audit record for each attempt.
- Keep provider/model orchestration outside the runtime.

## Components
- `ToolSpec`: name, description, required fields, handler, timeout.
- `ToolRegistry`: allowlisted lookup.
- `ExecutionPolicy`: authorization/approval seam.
- `ToolRuntime`: validation → policy → execution → result.
- `AuditSink`: append execution records.
- `ToolResult`: normalized success/failure envelope.

## Flow
Agent proposal (untrusted) → registry lookup → argument validation → policy check → bounded handler call → normalized result → audit.

## Design choices
- Dependency injection makes policy and audit behavior testable.
- Tool handlers are ordinary callables; MCP/HTTP/database implementations are adapters.
- Timeout is enforced with a worker thread for this synchronous educational version. A production async runtime should use cancellation-aware async handlers and process/container isolation for risky tools.
- A timeout cannot forcibly stop a Python thread. This is a bounded wait, not a security sandbox.

## FDE discussion
- Customer workflow and success metric: task completion rate, latency, tool error rate, cost per successful task.
- Trust: least privilege, approval for consequential actions, provenance and audit.
- Reliability: retries only for idempotent tools; deduplication keys for side effects.
- Operations: trace agent run → tool call → downstream request; redact sensitive arguments.
- Deployment: start with read-only tools, feature flags, limited tenants, feedback loop.
