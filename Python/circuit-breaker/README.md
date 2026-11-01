# Circuit Breaker (Python)

A state-machine-based resilience primitive with CLOSED, OPEN and HALF_OPEN states, injected clock, bounded probe calls and a separate retry policy.

## Run tests
From repository root:
```bash
python -m pytest Python/circuit-breaker/tests -v
```

## Scope
This is a deterministic, in-memory learning implementation. Replace in-memory adapters with durable/shared infrastructure for multi-process or production guarantees. See DESIGN.md and INTERVIEW.md before extending it.
