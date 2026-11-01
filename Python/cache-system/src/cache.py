"""An educational O(1) LRU cache implementation.

The cache uses a dictionary for lookup and a doubly linked list for recency.
The list is ordered from least recently used (head) to most recently used (tail).
"""

from __future__ import annotations

from dataclasses import dataclass
from typing import Generic, TypeVar

K = TypeVar("K")
V = TypeVar("V")


@dataclass(slots=True)
class _Node(Generic[K, V]):
    key: K | None = None
    value: V | None = None
    prev: _Node[K, V] | None = None
    next: _Node[K, V] | None = None


class LRUCache(Generic[K, V]):
    """Fixed-capacity cache using least-recently-used eviction."""

    def __init__(self, capacity: int) -> None:
        if isinstance(capacity, bool) or not isinstance(capacity, int):
            raise TypeError("capacity must be an integer")
        if capacity <= 0:
            raise ValueError("capacity must be greater than zero")

        self._capacity = capacity
        self._nodes: dict[K, _Node[K, V]] = {}
        self._head: _Node[K, V] = _Node()
        self._tail: _Node[K, V] = _Node()
        self._head.next = self._tail
        self._tail.prev = self._head

    @property
    def capacity(self) -> int:
        return self._capacity

    def __len__(self) -> int:
        return len(self._nodes)

    def get(self, key: K) -> V | None:
        """Return the value and mark it recently used; return None on a miss."""
        node = self._nodes.get(key)
        if node is None:
            return None
        self._move_to_most_recent(node)
        return node.value

    def put(self, key: K, value: V) -> None:
        """Insert or update a value, evicting the least-recently-used key."""
        node = self._nodes.get(key)
        if node is not None:
            node.value = value
            self._move_to_most_recent(node)
            return

        node = _Node(key=key, value=value)
        self._nodes[key] = node
        self._insert_before_tail(node)

        if len(self._nodes) > self._capacity:
            least_recent = self._head.next
            if least_recent is None or least_recent is self._tail:
                raise RuntimeError("LRU list invariant violated")
            self._remove(least_recent)
            del self._nodes[least_recent.key]  # type: ignore[index]

    def peek(self, key: K) -> V | None:
        """Read without changing recency (useful for diagnostics and tests)."""
        node = self._nodes.get(key)
        return None if node is None else node.value

    def _remove(self, node: _Node[K, V]) -> None:
        previous, following = node.prev, node.next
        if previous is None or following is None:
            raise RuntimeError("cannot remove a detached node")
        previous.next = following
        following.prev = previous
        node.prev = None
        node.next = None

    def _insert_before_tail(self, node: _Node[K, V]) -> None:
        previous = self._tail.prev
        if previous is None:
            raise RuntimeError("LRU tail invariant violated")
        node.prev = previous
        node.next = self._tail
        previous.next = node
        self._tail.prev = node

    def _move_to_most_recent(self, node: _Node[K, V]) -> None:
        self._remove(node)
        self._insert_before_tail(node)
