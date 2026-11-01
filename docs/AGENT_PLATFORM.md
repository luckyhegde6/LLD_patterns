# Agent Platform Portfolio Track

This repository now contains matching Python and TypeScript foundations for a scheduler, governed tool runtime and MCP stdio adapter.

## Components

| Component | Python | TypeScript |
|---|---|---|
| Task Scheduler | `Python/task-scheduler` | `Typescript/task-scheduler` |
| Agent Tool Runtime | `Python/agent-tool-runtime` | `Typescript/agent-tool-runtime` |
| MCP Server | `Python/mcp-server` | `Typescript/mcp-server` |

## Scheduler capabilities
Delayed jobs, priority ordering, lease-based claims, bounded retries with exponential backoff, retained terminal failures (DLQ records), worker lifecycle management and lock-manager interfaces. Redis adapters demonstrate token-owned distributed locks.

## Tool runtime capabilities
Explicit registry, JSON-schema subset validation, permission policy, execution timeout, bounded retries, normalized result envelope and per-attempt audit records. The runtime never evaluates model-generated code.

## MCP surface
Tools: `scheduler.schedule`, `scheduler.list`, `scheduler.run_due`, `runtime.tools.list`, `runtime.tools.execute`.

Resources: `scheduler://tasks`, `runtime://tools`, `runtime://audit`.

The stdio adapters implement the core JSON-RPC methods needed for MCP tool/resource discovery and calls. A demo `echo` tool is registered with a server-side permission resolver; caller-supplied permissions are not trusted.

## Run / test

Python:
```bash
python -m pytest Python -v
cd Python/mcp-server
python -m src.server
```

TypeScript:
```bash
npm test -- --runInBand
npm run mcp:server:ts
```

For MCP client configuration, run the TypeScript command from the repository root and configure the host to launch it as a stdio server.

## Honest production boundaries
In-memory stores/audit are not durable. The Redis lock adapter does not replace atomic claims in a shared task store. Tool timeouts cannot forcibly stop arbitrary Python threads or cancel all JavaScript promises. Production requires durable persistence, lease renewal/fencing, idempotency, tenant-scoped identity, transport authentication, audit retention/redaction, sandboxing for untrusted code, and operational metrics.
