# Cache System (Python)

A small in-memory cache with an LRU eviction policy.

## Features
- O(1) average-time `get` and `put`.
- Fixed capacity with least-recently-used eviction.
- Updating an existing key marks it most recently used.
- Explicit errors for invalid capacity.
- No external runtime dependencies.

## Run

From the repository root:

```bash
python -m pytest Python/cache-system/tests -v
```

## Example

```python
from cache import LRUCache

cache = LRUCache[int, str](capacity=2)
cache.put(1, "one")
cache.put(2, "two")
assert cache.get(1) == "one"
cache.put(3, "three")  # evicts key 2
assert cache.get(2) is None
```

## Complexity

| Operation | Average time | Space |
|---|---:|---:|
| get | O(1) | O(n) total |
| put | O(1) | O(n) total |

The implementation combines a dictionary for key lookup with a doubly linked list for recency ordering.
