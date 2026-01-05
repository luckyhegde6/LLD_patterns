# Parking Lot System 🍎🚗  
(Explained Like I’m 5)

## The Story

Imagine a big playground parking place.

Cars are like kids.
Parking spots are like chairs.

- Every car needs **one chair**
- One chair can hold **only one car**
- If all chairs are full, new cars must wait

When a car comes in, we give it a **paper ticket**.
The ticket says:
- Which chair the car is using
- What time the car came in

When the car leaves, we look at the ticket and say:
> “You stayed this long, pay this much.”

---

## What the System Is Really Doing

- **ParkingSpot** → a chair
- **Vehicle** → a kid
- **Ticket** → a reminder note
- **ParkingManager** → the teacher who assigns chairs

The teacher:
- Finds an empty chair
- Gives a ticket
- Later checks the ticket to calculate money

---

## Why This Is Hard (Even Though It Sounds Easy)

- Two cars must **never sit on the same chair**
- Prices might change tomorrow
- One day there may be many entry gates

So we:
- Keep chair logic separate
- Keep pricing rules separate
- Keep storage separate

This keeps the system calm and organized.

---

## Interview Thought (Adult Version)

> “This system is about **resource allocation**, **state management**, and **extensibility**.”

If you can say that and explain it with chairs, you win.

---

## 🔥 Top 5 Parking Lot Interview Questions (with answers)

1️⃣ How do you handle concurrent entry gates?

Use a **central manager** to assign chairs.

2️⃣ What if prices change?

Store prices in a **separate config**.

3️⃣ How do you prevent two cars from sitting on the same chair?

Use a **central registry** to track occupied chairs.

4️⃣ How do you handle parking lots with different sizes?

Use **polymorphism** for different lot sizes.

5️⃣ What if a car leaves without a ticket?

Implement a **timeout** system to handle such cases.
