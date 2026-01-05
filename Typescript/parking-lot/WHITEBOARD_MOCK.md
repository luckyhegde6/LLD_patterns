# Parking Lot — 30s Pitch, Whiteboard, Mock Interview

## ⏱ 30-Second Verbal Explanation

“A parking lot is a resource allocation system.
Cars arrive, take exactly one spot, and leave later.
I model spots as resources, tickets as state, and a manager that assigns spots and calculates price.
I separate pricing logic using a strategy so business rules can change.
Concurrency is handled by locking spot allocation so two cars never get the same spot.”

(Stop. Don’t keep talking.)

---

## 🧠 Whiteboard Diagram Prompts

Draw in this exact order:

1. Box: **Vehicle**
2. Box: **ParkingSpot**
3. Arrow: Vehicle → ParkingSpot (uses)
4. Box: **Ticket** (vehicleId, spotId, time)
5. Box: **ParkingManager**
   - arrows to Ticket & ParkingSpot
6. Side box: **PricingPolicy (Strategy)**

If time remains:
- Add “Repository” box under Ticket

---

## 🎤 Mock Interview (Interruption Style)

**Interviewer:** Why not put pricing logic inside Ticket?

**You:** Because pricing changes independently of ticket structure. Strategy keeps business rules isolated.

**Interviewer:** Two gates enter at the same time. What breaks?

**You:** Spot allocation. I’d lock at spot or level level—DB transaction or Redis lock.

**Interviewer:** How does this scale to 100 parking lots?

**You:** ParkingManager becomes per-lot. Shared services like pricing stay stateless.

**Interviewer:** What’s the hardest part?

**You:** Preventing double allocation under concurrency.

(Interviewer nods. You’re good.)
