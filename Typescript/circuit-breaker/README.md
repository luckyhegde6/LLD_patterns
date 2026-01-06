# Circuit Breaker + Retry Library (LLD)

Implements:
- Circuit breaker state machine
- Retry with backoff
- Failure isolation

## Run
```bash
npm install
npm test
```

## 🔥 Circuit Breaker Signals (Memorize This Line)

“Retry handles transient failures, while circuit breakers protect the system from cascading failure.”