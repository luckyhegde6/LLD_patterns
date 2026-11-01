# Task Scheduler — Design

## Goals
- Schedule delayed tasks with typed payloads
- Claim due work without two workers taking the same task in the same store
- Execute at least once, retry transient failures, and retain terminal failures
- Support priority and bounded batches

## Task lifecycle

```text
PENDING -> RUNNING -> deleted on success
                   -> PENDING (retry scheduled)
                   -> FAILED (terminal failure / dead-letter record)
RUNNING --lease expiry--> RUNNING (reclaimed by a worker)
```

## Architecture
Scheduler -> TaskStore.claimDueTasks() -> Worker -> Executor

The store owns the atomic claim operation. A persistent/distributed implementation must perform selection and state transition in one transaction or conditional update; a separate read followed by update is not sufficient.

## Current implementation boundaries
- `InMemoryTaskStore` is process-local and not durable.
- Claiming is atomic only within that process.
- Leases allow recovery after a worker disappears, but do not stop a paused worker from resuming after lease expiry. Production execution should use lease renewal/fencing tokens and idempotent handlers.
- Failed tasks remain in the store with `FAILED` status as a basic dead-letter record.
- Retry uses capped exponential backoff.
- Tasks are at-least-once; handlers must be idempotent.

## Senior-level evolution
1. Replace in-memory store with PostgreSQL using `FOR UPDATE SKIP LOCKED` or conditional claim updates.
2. Add lease owner, lease renewal and fencing token.
3. Persist attempt history and structured error metadata.
4. Add recurring/cron schedules, cancellation and task deduplication.
5. Add metrics, tracing, backpressure and per-queue concurrency.
6. Define shutdown semantics and graceful worker draining.
