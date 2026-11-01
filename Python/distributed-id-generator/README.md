# Distributed ID Generator (Python)

A Snowflake-style 64-bit, time-ordered ID generator with configurable epoch, node identity, sequence bits and clock rollback protection.

## Run tests
From repository root:
```bash
python -m pytest Python/distributed-id-generator/tests -v
```

## Scope
This is a deterministic, in-memory learning implementation. Replace in-memory adapters with durable/shared infrastructure for multi-process or production guarantees. See DESIGN.md and INTERVIEW.md before extending it.
