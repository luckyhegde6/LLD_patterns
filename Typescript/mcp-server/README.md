# MCP Server (TypeScript)

Minimal stdio JSON-RPC adapter exposing task scheduler and agent runtime tools/resources.

Run the adapter from a host entrypoint using `runStdio(adapter)`. It supports initialize, tools/list, tools/call, resources/list and resources/read over newline-delimited JSON.

Tools: `scheduler.schedule`, `scheduler.list`, `scheduler.run_due`, `runtime.tools.list`, `runtime.tools.execute`.
Resources: `scheduler://tasks`, `runtime://tools`, `runtime://audit`.

This is a compact educational MCP adapter. For production, prefer the official MCP SDK, add transport authentication, persistent storage and policy-derived actor identity.
