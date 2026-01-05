# Rate Limiter 🚦  
(Explained Like I’m 5)

## The Story

Imagine a water bottle.

You can drink water.
But if you drink too fast, you spill everything.

So the rule is:
- You get 5 sips now
- You get 1 new sip every second

If you try to drink without sips:
> “Stop. Wait a little.”

---

## What the System Is Really Doing

- Every user has a **bucket**
- The bucket has **tokens**
- Each request uses 1 token
- Tokens refill slowly

No tokens = no request.

---

## Why This Is Important

- Stops bad users
- Protects servers
- Keeps system healthy

But counting must be **perfect**.
Two requests must not use the same token.

So engineers:
- Use atomic operations
- Use Redis + Lua to think in one step

---

## Interview Thought (Adult Version)

> “Rate limiting is about **fairness**, **protection**, and **correctness under load**.”

---

## 🔥 Top 5 Rate Limiter Interview Questions (with answers)

1️⃣ How do you handle concurrent requests?

Use **locks** to prevent double booking.

2️⃣ What if prices change?

Store prices in a **separate config**.

3️⃣ How do you prevent two people from booking the same seat?

Use a **central registry** to track occupied seats.

4️⃣ How do you handle different movie showtimes?

Use **polymorphism** for different showtimes.

5️⃣ What if a booking times out?

Implement a **timeout** system to handle such cases.
