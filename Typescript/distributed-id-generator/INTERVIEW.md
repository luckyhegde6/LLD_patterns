# Distributed ID Generator — Interview Guide

## 30s Pitch
“I generate IDs using timestamp, node ID, and per-millisecond sequence,
ensuring uniqueness and ordering without coordination.”

---

## Interruptions

Interviewer: Why not UUID?
You: UUIDs are not time-ordered and hurt index locality.

Interviewer: Clock goes backward?
You: Either block until safe or fail fast.

Interviewer: More than 4096 IDs/ms?
You: Increase sequence bits or shard by node.

Interviewer: Central service?
You: That becomes a bottleneck and SPOF.

Interviewer: Hardest part?
You: Handling clock drift safely.
