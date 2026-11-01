import pytest

from src.cache import LRUCache


def test_get_returns_value_and_miss() -> None:
    cache: LRUCache[int, str] = LRUCache(2)
    cache.put(1, "one")
    assert cache.get(1) == "one"
    assert cache.get(99) is None


def test_eviction_removes_least_recently_used_entry() -> None:
    cache: LRUCache[int, str] = LRUCache(2)
    cache.put(1, "one")
    cache.put(2, "two")
    assert cache.get(1) == "one"
    cache.put(3, "three")

    assert cache.get(2) is None
    assert cache.get(1) == "one"
    assert cache.get(3) == "three"


def test_update_marks_entry_as_most_recently_used() -> None:
    cache: LRUCache[str, int] = LRUCache(2)
    cache.put("a", 1)
    cache.put("b", 2)
    cache.put("a", 10)
    cache.put("c", 3)

    assert cache.get("a") == 10
    assert cache.get("b") is None


def test_peek_does_not_change_recency() -> None:
    cache: LRUCache[int, str] = LRUCache(2)
    cache.put(1, "one")
    cache.put(2, "two")
    assert cache.peek(1) == "one"
    cache.put(3, "three")

    assert cache.get(1) is None


def test_capacity_must_be_positive() -> None:
    with pytest.raises(ValueError):
        LRUCache(0)
    with pytest.raises(ValueError):
        LRUCache(-1)


def test_capacity_must_be_an_integer() -> None:
    with pytest.raises(TypeError):
        LRUCache(1.5)  # type: ignore[arg-type]


def test_length_tracks_entries_after_eviction() -> None:
    cache: LRUCache[int, int] = LRUCache(1)
    cache.put(1, 10)
    cache.put(2, 20)
    assert len(cache) == 1
