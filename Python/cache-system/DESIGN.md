# Design: LRU Cache

## Requirements
- Store key/value pairs in memory.
- Enforce a positive maximum capacity.
- Return a missing-value sentinel (`None`) for absent keys.
- Evict the least recently used entry when inserting beyond capacity.
- Treat both reads and writes as use: the entry becomes most recently used.

## Design
- `LRUCache` is the public API.
- A dictionary maps keys to linked-list nodes for O(1) lookup.
- A doubly linked list orders entries from least recently used (head) to most recently used (tail).
- Sentinel nodes simplify insertion and removal by avoiding empty-list edge cases.

## Invariants
1. Every dictionary entry points to exactly one linked-list node.
2. Every linked-list node (except sentinels) is represented in the dictionary.
3. The list contains no duplicate keys.
4. The number of entries never exceeds capacity after a public operation.
5. The tail-adjacent entry is the most recently used.

## Trade-offs
- The linked list uses additional pointers and memory but gives O(1) eviction.
- An `OrderedDict` implementation would be shorter and idiomatic for production Python. This implementation uses a custom list to make the data structure and LLD trade-offs explicit.
- `None` is used for a cache miss; a production API may prefer a unique sentinel so cached `None` values are unambiguous.

## Extensions
- Add TTL expiration with an injectable clock.
- Add LFU as a separate eviction strategy.
- Add thread safety or async coordination if the cache is shared across concurrent workers.
