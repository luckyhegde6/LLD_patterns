# Task Scheduler — Design

## Lifecycle
PENDING → RUNNING (atomic claim + lease) → delete on success; on failure retry with capped exponential backoff or retain FAILED as a dead-letter record. Expired leases permit reclaim.

## Capabilities
Delayed jobs, priority ordering, bounded attempts, lease-based claims, worker polling lifecycle and lock-manager abstraction. RedisLockManager demonstrates token-owned SET NX PX locks.

## Boundaries
InMemoryTaskStore is process-local. A production shared store must claim atomically (e.g. transactional SQL), use lease renewal/fencing, preserve attempt history and require idempotent handlers. Distributed locks do not substitute for atomic store transitions.
