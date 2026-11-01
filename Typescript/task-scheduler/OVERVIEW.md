# Task Scheduler / Delayed Job System

## Responsibilities
| Component | Responsibility |
|---|---|
| Scheduler | Validate and accept typed task definitions |
| TaskStore | Persist tasks and atomically claim due work |
| Worker | Execute claimed tasks and apply state transitions |
| Executor | Run task handler logic |
| RetryPolicy | Capped exponential retry delays |
| LockManager | Local lock adapter; distributed correctness belongs in the store |
| Clock | Deterministic time in tests |

## Implemented in this module
- Typed payloads, priority and max attempts
- Due-task claims with leases and expiry-based reclaim
- Successful task cleanup
- Retry scheduling and retained FAILED records
- In-memory adapter and deterministic unit tests

## Not yet implemented
- Durable database store
- Redis queue or distributed lock adapter
- Lease renewal/fencing tokens
- Cron/recurring schedules
- Cancellation, deduplication, metrics and graceful shutdown

The in-memory implementation demonstrates the state machine; it is not a distributed production scheduler.
