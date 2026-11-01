# Agent Tool Runtime

A small, framework-neutral tool execution boundary for agentic applications. This is an LLD exercise inspired by tool calling and MCP-style integrations—not an MCP protocol server.

## Use case
An agent proposes a tool call. The runtime validates the tool name and arguments, checks execution policy, invokes the registered handler, and records a structured result. The model never receives direct access to arbitrary Python functions.

## Initial scope
- Typed tool definitions and JSON-schema-like argument validation.
- Explicit allowlist registry.
- Policy hook before execution (authorization / approval boundary).
- Per-call timeout.
- Structured success/error result and audit record.
- Deterministic unit tests with fake tools.

## Run
```bash
python -m pytest Python/agent-tool-runtime/tests -v
```

## Safety boundary
This starter does not implement authentication, sandboxing, secret management, or durable audit storage. Production adapters must add tenant identity, least-privilege authorization, isolated execution for untrusted code, rate/cost limits, redaction, and persistent audit logs.
