# How I Think About Rate Limiting (Interview Guide)

## Step 1: Clarify
“What is the unit? User? IP? API key?”
“What accuracy is required?”

## Step 2: Choose Algorithm
I start with Token Bucket because:
- Allows bursts
- Easy mental model
- Widely used in industry

## Step 3: Concurrency
This is NOT a CRUD problem.
Atomicity matters → Redis + Lua.

## Step 4: Failure Modes
- Redis down → fail open or closed?
- Clock skew → tolerate small drift
- TTL expiry → safe auto-recovery

## Step 5: Evolution
- Add headers: X-RateLimit-Remaining
- Per-endpoint limits
- Dynamic configs

## Why this design works
- Simple core
- Scales horizontally
- Easy to test
- Easy to explain

# 🔥 Top 5 Rate Limiter Interview Questions (with how to answer)

1️⃣ **Why Token Bucket over Sliding Window?**  
> Token Bucket allows controlled bursts while maintaining average rate.

2️⃣ **How do you prevent race conditions?**  
> Redis Lua scripts guarantee atomic check-and-update.

3️⃣ **What happens if Redis goes down?**  
> Choose fail-open for availability or fail-closed for security.

4️⃣ **How do you scale globally?**  
> Regional Redis + eventual consistency, or per-region limits.

5️⃣ **How do you test correctness?**  
> Unit tests for logic, concurrency tests, chaos tests for Redis failure.

---

## Where you are now
You now have **three senior-grade LLD systems**:
- Parking Lot
- Ticket Booking (Redis + Lua)
- Rate Limiter
