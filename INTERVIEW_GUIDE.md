# 📄 LLD Interview Playbook

## How Interviewers Evaluate LLD
They are NOT checking syntax.
They are checking:
- How you decompose problems
- How you reason about concurrency
- How you trade correctness vs scale

--- 

## Golden Rules
1. Start simple, evolve gradually
2. Call out assumptions early
3. Separate domain from infrastructure
4. Never ignore concurrency

---

## Parking Lot Signals ✅

- Strategy pattern → extensibility of pricing & allocation rules

- Repository abstraction → testability and persistence independence

- Pricing isolation → business agility without core refactors

- Concurrency awareness → safe spot allocation

- Clear domain modeling → readable and maintainable design

---

## Ticket Booking Signals 🎟️

- Redis Lua scripts → real-world concurrency handling

- Saga pattern → mature failure and compensation handling

- TTL-based seat holds → operational correctness under load

- Channel isolation (seat/payment) → partial failure tolerance

- Idempotent booking confirmation → safety under retries

---
## Rate Limiter Signals 🚦

- Token Bucket algorithm → balanced fairness and burst handling

- Redis + Lua atomicity → correctness in distributed systems

- Pluggable storage (in-memory / Redis) → environment flexibility

- Fail-open vs fail-closed reasoning → security vs availability trade-offs

- Explicit retry-after semantics → API consumer empathy

---

## Cache System Signals 🧠

- Policy abstraction (LRU/LFU) → separation of strategy from storage

- TTL orthogonality → clean handling of freshness vs capacity

- Deterministic eviction → predictable system behavior

- O(1) operations → performance awareness

- Clear cache-miss strategy → practical integration thinking

---
## Logger Framework Signals 📝

- Async dispatch → non-blocking production readiness

- Sink abstraction → extensibility without core changes

- Failure isolation → logging never crashes the app

- Level-based filtering → signal-to-noise control

- Backpressure awareness → operational maturity

---

## Notification System Signals 📬

- Async, queue-based delivery → resilience and scalability

- Channel isolation (Email/SMS/Push) → partial failure tolerance

- Retry with backoff → graceful degradation

- Idempotency keys → exactly-once effects over at-least-once delivery

- DLQ awareness → production-grade observability

---

## Task Scheduler Signals ⏰

- Persistent tasks → crash safety and durability

- Distributed locking → single execution guarantee

- Retry with backoff → transient failure handling

- Idempotent task execution → correctness under retries

- Worker-based polling model → horizontal scalability

---

## Payment Processing Signals 💰

- Payment Intent abstraction → separation of intent from execution

- Webhook-driven finality → real-world payment correctness

- Idempotency everywhere → no double charge guarantee

- Method-specific flows (Card vs UPI) → domain understanding

- Reconciliation mindset → operational and financial safety

---

## Senior-Level Bonus Points
- Idempotency
- Observability
- Graceful degradation
- Clear trade-offs

---

## What NOT to Do
- Over-engineer on first pass
- Skip failure scenarios
- Ignore scaling questions

---

## Recommended Practice Order
1. Parking Lot
2. Ticket Booking
3. Rate Limiter
4. Cache
5. Logger Framework
6. Notification System
7. Task Scheduler
8. Payment Processing

## One-Sentence “Killer Signal” for Each System

These are designed to be spoken once, then you stop talking.

### Parking Lot

“I used strategy and repository patterns to keep pricing and allocation extensible while ensuring safe spot allocation under concurrency.”

### Ticket Booking

“This is a concurrency problem solved with Redis Lua for atomic seat holds, Saga-style failure handling, and TTL locks for operational safety.”

### Rate Limiter

“I chose a Token Bucket with Redis Lua to balance burst traffic and fairness while guaranteeing correctness in a distributed setup.”

### Cache System

“I separated eviction policy from storage to support LRU/LFU cleanly, added TTL as an orthogonal concern, and kept all operations O(1).”

### Logger Framework

“The logger is async, sink-based, and failure-isolated so observability never blocks or crashes the application.”

### Notification System

“Notifications are async and idempotent, with channel isolation, retries, and backoff so partial failures don’t duplicate delivery.”

### Task Scheduler / Cron

“Tasks are persisted, locked before execution, retried with backoff, and executed idempotently to guarantee correctness under failures.”

### Payment Processing (Stripe + UPI)

“I model payments as intents, finalize state via webhooks, and enforce idempotency everywhere to prevent double charges.”

---
## LLD Interview Steering Cheat Sheet 🎯
Use this to guide the interviewer, not react to them.

### Phase 1: Control the Scope (First 2 minutes)

Say one of these early:

“I’ll start simple and then evolve for scale and failure.”

“I’ll assume correctness over performance first.”

“I’ll treat this as a concurrency problem.”

⚠️ This frames expectations and buys you time.
---

### Phase 2: Always Structure the Answer the Same Way

No matter the problem, follow this order:

Core entities

Happy path

Concurrency

Failures

Scaling

Interviewers expect this order.

---

### Phase 3: Drop One Strong Signal, Then Pause

Examples:

“This needs idempotency.”

“This requires atomic operations.”

“This should be async.”

“This is at-least-once with exactly-once effect.”

Then stop.
Silence forces follow-up questions (which you control).

---

### Phase 4: When Stuck, Use a Safe Escape Line

These lines never fail:

“That’s a trade-off between correctness and throughput.”

“This depends on failure tolerance.”

“I’d confirm this assumption with product.”

These are senior answers, not evasions.

---

### Phase 5: Close Strong

End with:

“If needed, I can evolve this to a distributed version.”

That signals depth without overengineering.

---

## LLD Rubric (What They Actually Judge)

``` markdown
| Dimension                 | What They Look For    | Your Signals                 |
| ------------------------- | --------------------- | ---------------------------- |
| **Problem Decomposition** | Clear entities & flow | Parking Lot, Cache           |
| **Concurrency Handling**  | No race conditions    | Ticket Booking, Rate Limiter |
| **Correctness**           | No duplicates / loss  | Payment, Notifications       |
| **Scalability**           | Horizontal thinking   | Task Scheduler, Rate Limiter |
| **Extensibility**         | Easy to add features  | Logger, Cache                |
| **Failure Handling**      | Retries, backoff, DLQ | Notifications, Scheduler     |
| **Trade-off Awareness**   | Knows costs           | All systems                  |
| **Communication**         | Explains simply       | “Explained like I’m 5” docs  |


``` 
