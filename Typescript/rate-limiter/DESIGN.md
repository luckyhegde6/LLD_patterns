# Rate Limiter — Design

## Problem and assumptions

Limit requests per identity while allowing controlled bursts. This implementation uses a Token Bucket with a configurable capacity and refill rate. A request costs one token.

## Domain operation

For each key, the store atomically:
1. Loads the current token count and last-refill timestamp (or initializes a full bucket).
2. Computes elapsed time, clamped to zero when the clock moves backwards.
3. Refills up to capacity.
4. Consumes one token when at least one token is available.
5. Persists the resulting state and expiry, including on denied requests.
6. Returns the decision, remaining whole tokens and optional retry delay.

## Boundaries and guarantees

- In-memory storage is suitable for one process and local development. It does not share quotas across replicas.
- Redis storage runs the full state transition inside a Lua script, which is atomic on the Redis server executing it.
- The Redis guarantee assumes all clients for a quota key use the same authoritative Redis primary. Cross-region multi-primary consistency is not provided.
- The clock is injected. Production instances should use synchronized clocks; backwards movement is clamped, but large forward jumps can refill a bucket to capacity.

## Trade-offs

| Choice | Benefit | Cost / limitation |
|---|---|---|
| Token Bucket | Controlled bursts and simple state | Does not enforce an exact rolling-window count |
| In-memory | Low latency, no network | Per-process quota only; state lost on restart |
| Redis + Lua | Atomic shared transition among clients on one primary | Network dependency; Redis availability and failover semantics matter |
| Denied-request persistence | Avoids crediting the same elapsed interval repeatedly | Writes even when the request is denied |

## Production evolution

- Define fail-open versus fail-closed behaviour at the caller boundary.
- Add Redis integration tests and test script loading/evaluation under the supported Redis topology.
- Define key cardinality limits and TTL policy.
- Add metrics for allowed/denied requests, Redis latency, errors and hot keys.
- Consider policy versioning and endpoint-specific costs.
- Define clock synchronization and regional quota semantics.
