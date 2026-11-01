# Agent Tool Runtime (Python)

Framework-neutral execution boundary for agentic tools: registry, JSON-schema subset validation, permission policy, timeout, bounded retries, normalized results and audit records.

Run:
```bash
python -m pytest Python/agent-tool-runtime/tests -v
```

Handlers are injected; model output is untrusted. This reference is not a sandbox and its audit sink is in-memory. Production needs durable audit, tenant-scoped authorization, secret isolation, rate/cost budgets and human approval for consequential actions.
