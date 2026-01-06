# Message Queue — Interview Guide

## 30s Pitch
“I use a partitioned append-only log where producers publish messages and consumers pull messages using offsets.”

---

## Interruptions

Interviewer: Why pull instead of push?
You: Consumers control pace → backpressure.

Interviewer: Ordering guarantee?
You: Only per partition.

Interviewer: Exactly-once?
You: Hard; use idempotent consumers.

Interviewer: Consumer crashes?
You: Reprocess from last committed offset.

Interviewer: Hardest part?
You: Offset management.
