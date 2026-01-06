# Master LLD Cheat Sheet (Staff-Level)

Use this to **steer any LLD interview**.

---

## 🧠 Universal LLD Structure (Always Follow)

1. Clarify requirements
2. Define core entities
3. Happy path
4. Concurrency
5. Failure handling
6. Scaling
7. Trade-offs

Never skip this order.

---

## 🔑 Killer One-Liners (Drop One, Then Stop)

- “This is a concurrency problem.”
- “I’ll model intent before execution.”
- “Correctness before throughput.”
- “At-least-once delivery with exactly-once effects.”
- “Fail fast to protect the system.”

---

## 🧩 System → Primary Signal Mapping

| System | What It Proves |
|------|----------------|
Parking Lot | Extensibility, modeling |
Ticket Booking | Concurrency, TTL, Saga |
Rate Limiter | Fairness, atomicity |
Cache | Performance & eviction |
Logger | Operational maturity |
Notification | Idempotency & retries |
Scheduler | Time & durability |
Payment | Money correctness |
ID Generator | Distributed thinking |
URL Shortener | Read-heavy optimization |
Message Queue | Async systems |
API Gateway | Platform thinking |
Feature Flags | Safe deployments |
Circuit Breaker | Failure containment |

---

## 🚨 Common Interview Traps (Avoid These)

❌ “I’ll just use Kafka”  
❌ “This is simple”  
❌ “We can optimize later” (without saying how)  

Replace with:

✅ “I’ll start simple and evolve”
✅ “Depends on failure tolerance”
✅ “That’s a trade-off between X and Y”

---

## ⚖️ Trade-off Language Interviewers Love

- Latency vs correctness  
- Availability vs consistency  
- Throughput vs fairness  
- Simplicity vs flexibility  

Say the trade-off explicitly.

---

## 🧠 When the Interviewer Pushes Back

Use these safe anchors:

- “Let’s consider failure modes”
- “What’s the SLA here?”
- “This depends on business risk”
- “I’d validate this assumption”

These are **Staff-level responses**.

---

## 🏁 Golden Rule

If you can:
- Explain it to a 5-year-old
- Defend it to a Principal
- Adjust it under pressure

You’re operating at Staff level.

---

## 🧘 Final Reminder

LLD interviews are not about:
> building the biggest system

They’re about:
> showing you can **protect production**

That’s what your portfolio now demonstrates.
