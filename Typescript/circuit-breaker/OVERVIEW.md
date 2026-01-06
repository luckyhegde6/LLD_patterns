# Circuit Breaker + Retry Library
Interview Framing

Design a circuit breaker library that protects downstream services from cascading failures and retries transient errors safely.

## Core Responsibilities

| Component      | Responsibility                   |
| -------------- | -------------------------------- |
| CircuitBreaker | Tracks failures & controls state |
| BreakerState   | CLOSED / OPEN / HALF_OPEN        |
| RetryPolicy    | Retries transient failures       |
| FailureTracker | Sliding window error tracking    |
| ProtectedCall  | Executes guarded operations      |


## Key Design Decisions

Fail fast when unhealthy

Separate retry from circuit breaker

State machine driven

Time-based recovery

Library-style (not service)

## Repo Structure (Final)
```
circuit-breaker/
├── src/
│   ├── core/
│   │   ├── CircuitBreaker.ts
│   │   ├── CircuitState.ts
│   │   ├── FailureTracker.ts
│   │   └── ProtectedExecutor.ts
│   ├── retry/
│   │   └── RetryPolicy.ts
│   └── index.ts
├── tests/
│   ├── breaker.test.ts
│   └── retry.test.ts
├── DESIGN.md
├── INTERVIEW.md
├── CIRCUIT_BREAKER_EXPLAINED_LIKE_IM_5.md
├── CIRCUIT_BREAKER_WHITEBOARD_30SEC_MOCK.md
├── README.md
└── package.json


```