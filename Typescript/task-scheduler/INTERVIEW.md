# Task Scheduler — Senior-Level Interview Guide

## 30-second pitch
“I persist task definitions with a due time and status. Workers atomically claim due tasks using a lease, execute handlers, and either delete successful tasks, reschedule failures with capped exponential backoff, or retain terminal failures for inspection.”

## Clarify first
- One-time delayed jobs or recurring cron?
- What are delivery guarantees: at-most-once or at-least-once?
- What is the expected task volume and scheduling precision?
- How are retries, poison jobs and idempotency handled?
- Can jobs be cancelled or reprioritized?
- Is scheduling regional or global?

## Concurrency and failure
- Two workers must not claim the same pending task simultaneously: use an atomic store claim.
- Worker crash: lease expiry permits reclaiming.
- A stale worker may resume after lease expiry: production needs fencing/renewal and idempotent handlers.
- Repeated failure: capped exponential backoff, then a retained FAILED/dead-letter record.
- Store outage: define retry and admission behaviour at the API boundary.

## Trade-offs
- Polling is simple but adds latency and database load; a queue or due-time index can reduce polling cost.
- In-memory storage is useful for learning but not durable or cross-instance.
- At-least-once delivery is practical; exactly-once side effects require idempotency or transactional integration.
- Priority can starve low-priority jobs; consider aging or separate queues.

## Implementation walkthrough
- `Scheduler`: validates and creates task records.
- `TaskStore.claimDueTasks`: atomic claim boundary.
- `Worker`: executes and applies retry/dead-letter transitions.
- `RetryPolicy`: capped exponential backoff.
- `InMemoryTaskStore`: local reference adapter, not production persistence.
