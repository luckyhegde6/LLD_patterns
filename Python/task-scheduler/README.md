# Task Scheduler (Python)

Delayed jobs, priority ordering, due-task claims with leases, bounded exponential retries, retained failed tasks as dead-letter records, worker lifecycle management and lock adapters.

Run from repository root:
```bash
python -m pytest Python/task-scheduler/tests -v
```

The in-memory store is process-local. `RedisLockManager` demonstrates token-owned Redis locks, but production distributed correctness also requires atomic durable claims, lease renewal/fencing, idempotent handlers and observability.
