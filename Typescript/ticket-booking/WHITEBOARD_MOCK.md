# Ticket Booking — 30s Pitch, Whiteboard, Mock Interview

## ⏱ 30-Second Verbal Explanation

“Ticket booking is a concurrency problem.
Seats are limited resources and must not be double-booked.
I introduce seat holding with a TTL so users get a short window to pay.
Redis with atomic operations ensures correctness.
Booking confirmation is done after payment, using a Saga-style flow.”

Stop talking here.

---

## 🧠 Whiteboard Diagram Prompts

Draw in this order:

1. Box: **Seat**
2. Group seats → Box: **Show**
3. Box: **SeatHold (TTL)**
4. Box: **Booking (CONFIRMED / CANCELLED)**
5. Box: **Payment Service**
6. Arrow flow:
   Seat → Hold → Payment → Booking

Circle **SeatHold** and write: “TTL + atomic”.

---

## 🎤 Mock Interview (Interruption Style)

**Interviewer:** Why not just mark seat as booked immediately?

**You:** Because payment may fail. Holding avoids permanent locking.

**Interviewer:** Two users click at the same millisecond?

**You:** Redis Lua script ensures atomic seat removal.

**Interviewer:** Redis crashes mid-hold?

**You:** TTL auto-expires holds. Worst case: seat becomes available again.

**Interviewer:** What’s the real challenge here?

**You:** Correctness under high concurrency.

(This is a strong answer.)
