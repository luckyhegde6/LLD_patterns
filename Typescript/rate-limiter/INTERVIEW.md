# Rate Limiter — Senior-Level Interview Guide

## Clarify first

- Is the quota per user, IP, API key, tenant, or endpoint?
- Is the limit local to one process, regional, or global?
- What are capacity, refill rate and request cost?
- Is a burst allowed?
- Should the system fail open or closed when Redis is unavailable?
- What response headers and retry semantics are required?

## Explain the model

A Token Bucket has:
- **Capacity:** maximum number of stored tokens.
- **Refill rate:** tokens added per second.
- **Current tokens:** available request budget.
- **Last refill time:** timestamp used to calculate elapsed refill.

The store operation is atomic because two requests must not both observe the same final token and both consume it.

## Explain the implementation

- `TokenBucket` validates configuration and delegates a single state transition.
- `Clock` makes time deterministic in tests.
- `Store` is a port; adapters implement atomic consumption.
- `InMemoryStore` provides process-local atomicity.
- `RedisStore` executes read/refill/consume/write in one Lua script.

## Senior trade-offs

- **In-memory vs Redis:** local speed versus shared quota correctness.
- **Fail-open vs fail-closed:** availability versus abuse/security protection.
- **Regional vs global:** latency and resilience versus exact global enforcement.
- **Token Bucket vs Sliding Window:** controlled bursts versus a closer rolling-window quota.
- **TTL:** bounds stale key lifetime but must be consistent with the refill policy.

## Failure modes to discuss

- Redis timeout or failover.
- Large forward or backward clock movement.
- Hot keys and high-cardinality identities.
- Policy updates while a bucket contains tokens.
- Redis Cluster key placement and script execution topology.

## Validation status

Unit tests cover in-memory refill, capacity, identity isolation, backward clock movement, invalid input and concurrent calls in a single process. Redis integration and cross-instance tests must still be run against a real Redis service; do not claim those guarantees are verified until CI executes them.
