# Circuit Breaker — Interview Guide

## 30s Pitch
“I wrap downstream calls with retry for transient failures
and a circuit breaker to stop cascading failures.”

---

## Interruptions

Interviewer: Retry vs breaker?
You: Retry fixes transient issues; breaker protects system.

Interviewer: When HALF_OPEN?
You: After cooldown to test recovery.

Interviewer: Distributed breakers?
You: Use shared metrics or per-instance breakers.

Interviewer: Metrics?
You: Failure rate, latency, open time.

Interviewer: Hardest part?
You: Tuning thresholds.
