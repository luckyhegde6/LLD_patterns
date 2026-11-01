# Task Scheduler (TypeScript)

Delayed tasks, priority ordering, atomic store-level claims with leases, bounded retries/backoff, retained terminal failures (dead-letter records), worker polling lifecycle and lock-manager abstraction.

Run tests from the repository root with `npm test -- --runInBand`.

The in-memory store and lock are process-local. `RedisLockManager` demonstrates token-owned Redis SET NX PX locks; a production shared store must still atomically claim tasks and should use lease renewal/fencing, durable attempt history and idempotent handlers.
