# Cache System 🧠⚡  
(Explained Like I’m 5)

## The Story

Your brain remembers things.

- Your name? Easy.
- What you ate last year? Gone.

Your brain keeps:
- Things you use a lot
- Things you used recently

A cache works the same way.

---

## Two Ways to Forget

### 🟢 LRU (Least Recently Used)
You forget the toy you haven’t played with for a long time.

### 🔵 LFU (Least Frequently Used)
You forget the toy you almost never play with.

---

## Time To Live (TTL) ⏰

Some things expire.

- Milk expires
- Cache entries expire

If it’s too old:
> “Throw it away.”

---

## Why This Matters

- Cache must be fast
- Cache must not grow forever
- Cache must forget correctly

So engineers:
- Limit size
- Choose forgetting rules
- Remove old items when accessed

---

## Interview Thought (Adult Version)

> “Caching is about **memory efficiency** and **access patterns**.”

---

## 🔥 Top 5 Cache Interview Questions (with answers)

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
