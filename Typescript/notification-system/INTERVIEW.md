# Notification System — Interview Explanation

## 30s Pitch
“I decouple notification intent from delivery.
Notifications are queued, processed async, retried on failure,
and deduplicated using idempotency keys.
Each channel is isolated so partial failures don’t cascade.”

---

## Interruptions

**Interviewer:** Why async?
**You:** Providers are slow and unreliable; async protects core flows.

**Interviewer:** Email succeeds, SMS fails?
**You:** Channels are independent. Retry only failed channel.

**Interviewer:** Duplicate sends?
**You:** Idempotency key per notification+channel.

**Interviewer:** Provider down?
**You:** Exponential backoff and DLQ.

**Interviewer:** Hardest part?
**You:** Reliable delivery without duplication.
