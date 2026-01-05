# Notification System — Whiteboard + Mock Interview

---

## ⏱ 30-Second Verbal Explanation (Say This)

“A notification system delivers messages through multiple channels like email, SMS, and push.
I separate message creation from delivery.
Notifications are queued, processed asynchronously, retried on failure, and sent via channel-specific providers.
The system is idempotent and resilient to partial failures.”

Stop talking here.

---

## 🧠 Whiteboard Diagram (Draw in This Order)

Draw left → right.

1. Box: **Application**
   - emits notification request

2. Arrow → Box: **Notification Service**
   - validates
   - persists intent

3. Arrow → Box: **Queue**
   - retryable
   - async

4. Arrow → Box: **Dispatcher**

5. Branch into:
   - **Email Provider**
   - **SMS Provider**
   - **Push Provider**

Under Dispatcher write:
- “Retries”
- “Backoff”
- “Idempotency key”

Optional if time:
- Dead Letter Queue (DLQ)

---

## 🎤 Mock Interview (Interruptions Included)

**Interviewer:** Why not send email directly from the app?

**You:** External providers are slow and unreliable. Async decoupling protects core flows.

---

**Interviewer:** Email succeeds, SMS fails. What now?

**You:** Channels are independent. Retry failed channel without duplicating others.

---

**Interviewer:** How do you prevent duplicate notifications?

**You:** Use idempotency keys stored per message per channel.

---

**Interviewer:** Provider is down for 30 minutes?

**You:** Exponential backoff + DLQ for manual inspection.

---

**Interviewer:** What’s the hardest part?

**You:** Failure handling without duplicate delivery.

(Interviewer is convinced.)
