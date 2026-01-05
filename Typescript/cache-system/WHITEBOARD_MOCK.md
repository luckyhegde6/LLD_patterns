# Cache System — 30s Pitch, Whiteboard, Mock Interview

## ⏱ 30-Second Verbal Explanation

“A cache stores frequently or recently used data to avoid slow lookups.
I separate cache storage from eviction policy.
LRU evicts least recently used items; LFU evicts least frequently used ones.
TTL ensures stale data expires.
Eviction is deterministic and tested.”

Stop there.

---

## 🧠 Whiteboard Diagram Prompts

Draw in this order:

1. Box: **Cache**
2. Inside: key → value
3. Side box: **Eviction Policy**
   - LRU
   - LFU
4. Write under cache: “Capacity”
5. Write near entry: “TTL”

If asked:
- Draw linked list for LRU
- Draw frequency counters for LFU

---

## 🎤 Mock Interview (Interruption Style)

**Interviewer:** LRU or LFU—pick one.

**You:** Depends on access pattern. LRU for temporal locality, LFU for stable hot keys.

**Interviewer:** TTL + eviction—conflict?

**You:** No. TTL removes expired entries; eviction handles capacity.

**Interviewer:** Cache miss?

**You:** Fetch from DB and repopulate—read-through cache.

**Interviewer:** Biggest risk?

**You:** Memory blowup without eviction.

(Interviewer is satisfied.)
