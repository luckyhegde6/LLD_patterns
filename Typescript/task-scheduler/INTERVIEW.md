# Task Scheduler — Interview Guide

## 30s Pitch
“I persist tasks with execution time, workers poll for due tasks,
acquire a lock, execute idempotently, and retry failures with backoff.”

---

## Interruptions

**Interviewer:** Why persist tasks?
**You:** Crash recovery and durability.

**Interviewer:** Two workers pick same task?
**You:** Distributed lock before execution.

**Interviewer:** Task executes twice?
**You:** Idempotent handlers + deduplication.

**Interviewer:** Worker crashes mid-task?
**You:** Lock expires, task retried.

**Interviewer:** Hardest part?
**You:** Correct execution under failures.
