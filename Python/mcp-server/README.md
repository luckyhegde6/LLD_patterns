# MCP Server (Python)

A stdio JSON-RPC MCP adapter exposing scheduler tools and runtime tools/resources.

Run from `Python/mcp-server` with `python -m src.server` after the Python packages are installed. MCP protocol messages are newline-delimited JSON on stdin/stdout; do not write logs to stdout.

Tools: `scheduler.schedule`, `scheduler.list`, `scheduler.run_due`, `runtime.tools.list`, `runtime.tools.execute`.
Resources: `scheduler://tasks`, `runtime://tools`, `runtime://audit`.

This is a compact protocol adapter for learning. Production deployments should use the official MCP SDK, transport authentication where applicable, persistent stores and policy-backed actor identity.
