# Cache LLD – Interview Guide

## Step 1: Clarify
“What matters more — recency or frequency?”

## Step 2: Separate Policy
Eviction is a strategy, not core logic.

## Step 3: TTL
TTL is orthogonal to eviction.
Expired entries are removed lazily.

## Step 4: Trade-offs
LRU: simple, predictable  
LFU: better hit rate, more bookkeeping

## Step 5: Scaling
- Shard cache by key
- Add Redis for distribution
- Add local + remote hybrid cache

## Why This Design Works
- Easy to extend
- Easy to test
- Easy to explain

## Example

```typescript
const cache = new InMemoryStore<string, string>(
  2,
  new LRUPolicy()
);

// Add items
cache.put("a", "1");
cache.put("b", "2");
cache.get("a");
cache.put("c", "3"); // evicts "b"

// Retrieve items
console.log(cache.get("b").hit); // false
console.log(cache.get("a").hit); // true
```

## 🔥 Top 5 Cache Interview Questions (with answers)

1️⃣ LRU vs LFU — when to use which?

LRU for temporal locality, LFU for stable access patterns.

2️⃣ How do you support TTL efficiently?

Lazy eviction on read/write; background cleanup optional.

3️⃣ How do you make cache thread-safe?

Locks or concurrent maps; Redis for distributed safety.

4️⃣ How would you scale this globally?

Multi-level cache (L1 local, L2 Redis).

5️⃣ What happens on cache miss?

Fallback to DB, populate cache (read-through).