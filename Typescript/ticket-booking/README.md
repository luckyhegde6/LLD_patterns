# Ticket Booking LLD

## Overview
Low-level design for a BookMyShow-like ticket booking system. Focuses on seat hold, concurrency-safe booking, payments, and extensible adapters.

## Design highlights
- Seat holds implemented via distributed store (Redis) with TTL
- Saga-style orchestration for booking → payment → confirmation
- Repository pattern and adapters for Payment
- Caching for read-heavy show listings; seat availability uses Redis for speed

## How to run (dev)
1. `npm install`
2. Start a local Redis (recommended for seat locks)
3. `ts-node src/index.ts` to run example flows

## File structure
- `/models` domain objects
- `/services` booking orchestration & adapters
- `/repositories` persistence
- `/controllers` API endpoints

## Assumptions
- Payment is external, integrated via adapters
- Seat numbering unique per screen
- TTL-based seat holds ensure fairness

## Scaling notes
- For millions of seats / shows: partition Redis by show (hashing).
- Use event-driven microservices for payments/notifications.
- For read-heavy operations, use Redis cache or a dedicated read replica.

## Next steps
- Implement Lua scripts for atomic seat operations in Redis
- Add benchmarking & automated integration tests
- Add refund & settlement microservice and retry strategies

## Folder Structure
- `/models` domain objects
- `/services` booking orchestration & adapters
- `/repositories` persistence
- `/controllers` API endpoints
- `/events` event handling

```
/ticket-booking
  /src
    /models
      Theater.ts
      Screen.ts
      Seat.ts
      Show.ts
      Booking.ts
      enums.ts
    /services
      BookingService.ts
      SeatLockManagerRedis.ts
      PaymentAdapter.ts
      RefundService.ts
    /repositories
      ShowRepo.ts
      BookingRepo.ts
      InMemoryBookingRepo.ts
    /controllers
      ShowsController.ts
      BookingController.ts
    /events
      BookingEvents.ts
    index.ts
  package.json
  README.md
```
---

# Ticket Booking System — Low Level Design

## Interview Problem
Design a ticket booking system like BookMyShow that:
- Prevents double booking
- Handles high concurrency
- Supports payment failures
- Scales horizontally

---

## Core Challenges
1. Seat concurrency
2. Payment consistency
3. Failure recovery

---

## Design Approach

### Seat Locking
- Redis SET for available seats
- Lua scripts ensure atomicity
- TTL auto-expires stale locks

### Booking Flow
1. Hold seats
2. Take payment
3. Confirm booking
4. Release on failure

### Patterns Used
- Saga pattern
- Repository pattern
- Adapter (payment)
- Idempotency-safe operations

---

## How to Explain in Interview

> “Seat booking is a concurrency problem, not a CRUD problem.”

- Redis Lua ensures atomic seat allocation
- TTL protects against abandoned sessions
- Booking confirmation is idempotent

---

## Trade-offs
| Option | Pros | Cons |
|------|------|------|
DB Locking | Strong consistency | Low throughput |
Redis Locks | Fast & scalable | Needs careful TTL handling |

---

## How to Run
```bash
npm install
npm start
```

## Extensions

- Dynamic pricing
- Cancellation & refunds
- Event-driven notifications