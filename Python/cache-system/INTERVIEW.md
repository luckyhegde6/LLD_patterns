# Interview Notes: LRU Cache

## Explain the approach
Use a dictionary to locate entries quickly and a doubly linked list to track recency. Move an entry to the tail after every successful read or write. When capacity is exceeded, remove the node next to the head and delete its key from the dictionary.

## Why a doubly linked list?
An entry can be removed from any position in O(1) when its node is known. A singly linked list would require finding its predecessor.

## Complexity
- `get`: O(1) average.
- `put`: O(1) average.
- Space: O(capacity).

## Edge cases to discuss
- Capacity of zero or less.
- Reading a missing key.
- Updating an existing key.
- Evicting after insertion.
- Reading the current least-recently-used item.
- Whether `None` can be a valid cached value.

## Senior-level follow-ups
- How would you add TTL without scanning every entry?
- How would you make this thread-safe?
- Would you use a lock or sharding under high contention?
- When would `collections.OrderedDict` be preferable?
- How would you expose hit, miss, and eviction metrics?
