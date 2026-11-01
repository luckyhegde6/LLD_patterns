# Rate Limiter — Low-Level Design

A Token Bucket implementation with interchangeable in-memory and Redis-backed state stores.

## Current guarantees

- Token refill and consumption are a single store operation.
- The in-memory adapter is atomic within one Node.js process only.
- The Redis adapter uses one Lua script for atomic read/refill/consume/write across clients sharing the same Redis primary.
- A clock is injected to make timing behaviour deterministic.
- Denied requests persist the observed refill timestamp, avoiding repeated crediting of the same interval.
- Backwards clock movement is clamped to zero elapsed time.

## Run

From the repository root:

```bash
npm install
npm test
```

The Redis adapter uses the existing `ioredis` dependency in this package. A Redis integration test and multi-instance test should be run against a real Redis service before describing the distributed path as operationally verified.

## Use cases

- API gateway request throttling
- Per-user or per-API-key quotas
- Abuse prevention

## Design

- **Strategy:** Token Bucket is the selected algorithm.
- **Port / Adapter:** the `Store` interface separates the state transition from the backing store.
- **Atomicity:** an adapter must implement `consumeToken` as one atomic operation.
