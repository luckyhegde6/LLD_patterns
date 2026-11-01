# MCP Server (Python)

Minimal stdio JSON-RPC MCP adapter exposing scheduler and agent-runtime tools/resources.

Run from this folder:
```bash
python -m src.server
```

The demo registers an `echo` tool. The server-side permission resolver grants its permission only to actor `demo-agent`; caller-supplied permissions are not accepted.

Tools: `scheduler.schedule`, `scheduler.list`, `scheduler.run_due`, `runtime.tools.list`, `runtime.tools.execute`.
Resources: `scheduler://tasks`, `runtime://tools`, `runtime://audit`.

The adapter supports stdio JSON-RPC discovery/calls. It is a compact learning implementation; production should use the official MCP SDK and add transport authentication, durable state and policy-derived identity.
