# Payment Processing — Interview Guide

## 30s Pitch
“I create a payment intent first, then process via a gateway.
Final state is set only via webhooks.
Idempotency ensures no double charge.”

---

## Interruptions

**Interviewer:** Why payment intent?
**You:** It separates intent from execution and supports retries safely.

**Interviewer:** Card vs UPI difference?
**You:** Card is synchronous, UPI is user-approved async.

**Interviewer:** Duplicate webhook?
**You:** Idempotent updates.

**Interviewer:** Money charged but app crashes?
**You:** Webhook reconciliation updates final state.

**Interviewer:** Hardest part?
**You:** Correctness under partial failures.
