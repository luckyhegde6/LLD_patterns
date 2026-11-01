# Task Scheduler — Design Notes

## Core flow
Schedule delayed task → atomically claim due work → execute → complete, retry with capped backoff, or retain terminal failure in the dead-letter map.

## Components
- Task: due time, priority, attempts, status and lease owner.
- Scheduler: idempotent schedule-by-ID, ordered claim, retry and DLQ transition.
- WorkerManager: background polling lifecycle and deterministic poll-once hook.
- LockManager: process-local adapter and Redis SET NX PX + token-checked release adapter.

## Guarantees / limitations
In-memory claim state is process-local and lost on restart. Redis locking is a coordination adapter, not a replacement for transactional task claims. Production needs a durable store, fencing/lease renewal, handler idempotency, retry jitter, graceful shutdown and metrics.
