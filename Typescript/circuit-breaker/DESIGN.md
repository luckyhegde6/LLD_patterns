# Circuit Breaker + Retry — Design

## Goals
- Prevent cascading failures
- Fail fast on unhealthy dependencies
- Retry only transient failures

## Architecture
Caller → Retry → Circuit Breaker → Downstream

## States
- CLOSED: normal
- OPEN: fail fast
- HALF_OPEN: test recovery

## Trade-offs
- Aggressive thresholds protect system
- Loose thresholds risk overload
