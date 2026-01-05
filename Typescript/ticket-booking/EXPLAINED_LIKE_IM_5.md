# Ticket Booking System 🎬🎟  
(Explained Like I’m 5)

## The Story

You want to watch a movie.

There are many seats.
You choose seat A1.

At the same time, another person also wants seat A1.

Only **one person can sit there**.

So the system says:
> “I will hold this seat for you for 5 minutes. Hurry and pay!”

---

## What the System Is Really Doing

- **Seat** → a toy
- **Show** → playtime
- **Booking** → “this toy is mine”
- **Seat Lock** → “hands off, someone is using it”

If you pay in time:
- The seat becomes yours

If you don’t:
- The seat goes back to the shelf

---

## Why This Is Hard

- Thousands of people click at the same time
- Computers are very fast
- Mistakes cause **double booking** (very bad)

So engineers:
- Lock seats for a short time
- Use timers (TTL)
- Use Redis to remember locks safely

---

## Interview Thought (Adult Version)

> “Seat booking is a **concurrency problem**, not a CRUD problem.”

That sentence alone shows maturity.

---

## 🔥 Top 5 Ticket Booking Interview Questions (with answers)

1️⃣ How do you handle concurrent bookings?

Use **locks** to prevent double booking.

2️⃣ What if prices change?

Store prices in a **separate config**.

3️⃣ How do you prevent two people from booking the same seat?

Use a **central registry** to track occupied seats.

4️⃣ How do you handle different movie showtimes?

Use **polymorphism** for different showtimes.

5️⃣ What if a booking times out?

Implement a **timeout** system to handle such cases.
