# 60-Min Staff-Level LLD Mock Interview

This mock simulates a **real Staff/Principal interview**.
The interviewer interrupts, challenges assumptions, and changes scope.

---

## ⏱ Interview Structure (What’s Actually Happening)

- 0–5 min: Framing & clarification
- 5–20 min: Core design
- 20–35 min: Deep dive & edge cases
- 35–50 min: Scaling & failures
- 50–60 min: Trade-offs & leadership

---

## 🟢 Minute 0–5: Framing

**Interviewer:**  
Design a system to handle payments and notifications reliably.

**You (ideal):**  
“I’ll start with correctness and failure handling first, then scale.”

(You just bought safety.)

---

## 🟢 Minute 5–20: Core Design

**Interviewer:** Walk me through your design.

**You:**  
“I’d separate intent from execution.  
For payments, I create a Payment Intent first.  
For notifications, I enqueue delivery asynchronously.”

**Interviewer:** Why separate intent?

**You:**  
“Because execution can fail, retry, or be delayed.  
Intent is the source of truth.”

✔️ Senior signal: *modeling before code*

---

## 🟡 Minute 20–35: Deep Dive (Interruptions)

**Interviewer:**  
What if Stripe times out but actually charges the card?

**You:**  
“I don’t mark success on the request path.  
Final state is set via webhook reconciliation.”

**Interviewer:** Duplicate webhooks?

**You:**  
“Idempotency keys per payment + channel.”

**Interviewer:** What if Redis is down?

**You:**  
“Fail closed for payments, fail open for notifications depending on SLA.”

✔️ Staff signal: *risk-based decisions*

---

## 🟠 Minute 35–50: Scaling & Failure

**Interviewer:**  
This system gets 10x traffic overnight. What breaks first?

**You:**  
“Notification delivery.  
I’d scale consumers horizontally and protect providers with circuit breakers.”

**Interviewer:**  
Why not scale everything?

**You:**  
“Scaling correctness paths blindly risks money errors.”

✔️ Leadership signal: *prioritization*

---

## 🔴 Minute 50–60: Trade-offs & Leadership

**Interviewer:**  
What trade-offs did you consciously make?

**You:**  
- At-least-once delivery with idempotency  
- Slight latency for correctness  
- Fail-safe defaults over availability in payments  

**Interviewer:**  
How would you explain this system to a junior?

**You:**  
“I’d explain it as writing things down before doing them,  
and double-checking before saying it’s done.”

✔️ Staff signal: *teaching ability*

---

## ✅ How You Pass This Interview

You pass if you:
- Don’t rush to scale
- Talk about failures naturally
- Admit trade-offs explicitly
- Explain simply when asked

You fail if you:
- Jump straight to Kafka
- Over-optimize early
- Ignore money correctness

---

## 🎯 Final Tip

If stuck, say:
> “Let me step back and reframe the failure modes.”

That sentence alone resets the room.
