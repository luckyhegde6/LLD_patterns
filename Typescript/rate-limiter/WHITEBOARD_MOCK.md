# Rate Limiter — 30s Pitch, Whiteboard, Mock Interview

## ⏱ 30-Second Verbal Explanation

“A rate limiter protects systems from abuse.
I use a Token Bucket algorithm which allows bursts but controls average rate.
Each request consumes a token; tokens refill over time.
For distributed systems, I use Redis with atomic Lua scripts to avoid race conditions.”

Stop. Silence is confidence.

---

## 🧠 Whiteboard Diagram Prompts

Draw in this order:

1. Draw a **bucket**
2. Label: “tokens”
3. Arrow: Request → Token (consume)
4. Arrow: Time → Token (refill)
5. Box: **Redis**
6. Write: “Atomic Lua”

Optional:
- Show per-user key: `bucket:userId`

---

## 🎤 Mock Interview (Interruption Style)

**Interviewer:** Why Token Bucket over Sliding Window?

**You:** Token Bucket allows controlled bursts, which is better for APIs.

**Interviewer:** What if Redis is down?

**You:** Depends on risk tolerance—fail open for availability or fail closed for security.

**Interviewer:** How do you test correctness?

**You:** Unit tests for logic, concurrency tests, and Redis failure simulation.

**Interviewer:** One word summary?

**You:** Protection.

(That’s a senior answer.)
