# API Gateway (Python)

A framework-agnostic gateway pipeline for authentication, authorization, routing, per-tenant quotas, backend selection, and structured observability.

## Run tests
From repository root:
```bash
python -m pytest Python/api-gateway/tests -v
```

## Scope
This is a deterministic, in-memory learning implementation. Replace in-memory adapters with durable/shared infrastructure for multi-process or production guarantees. See DESIGN.md and INTERVIEW.md before extending it.
