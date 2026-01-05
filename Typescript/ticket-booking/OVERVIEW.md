## Overview
Low-level design for a BookMyShow-like ticket booking system. Focuses on seat hold, concurrency-safe booking, payments, and extensible adapters.

## BookMyShow-like Ticket Booking System — LLD
### High-level summary

A movie-ticket booking system: supports multiple theaters, screens, shows, seat management, bookings, payments, cancellations, and notifications. Designed for concurrency (seat locking), eventual consistency via events, and microservice-friendly architecture (recommend split into Show Service, Booking Service, Payment Service, Notification Service).

### Functional requirements (FR)

- FR1 — Create theaters, screens, seats, shows.

- FR2 — User can search shows by movie, date, theater.

- FR3 — Book seats for a show (seat selection).

- FR4 — Hold/lock seats for a short TTL while user pays.

- FR5 — Confirm booking after successful payment; release held seats on timeout or cancellation.

- FR6 — Cancel booking & refund (policy-based).

- FR7 — Generate user booking history, seats layout, availability.

- FR8 — Support multiple payment adapters (cards, wallets).

- FR9 — Support dynamic pricing (peak vs normal).

### Non-functional requirements (NFR)

- NFR1 — Concurrency-safe seat allocation (no double booking).

- NFR2 — High throughput for reads (show listings) — use caches/CDN.

- NFR3 — Strong availability for reads; eventual consistency for some write flows (booking stream).

- NFR4 — Resilience to payment failures (Saga pattern).

- NFR5 — Auditability and idempotency (idempotent booking API).

### Core entities & responsibilities

- `Theater` — address, screens

- `Screen` — seat layout, capacity

- `Seat` — seatId, row, number, type (Regular/Premium)

- `Show` — movie, startTime, screenId, pricing policy

- `Booking` — bookingId, showId, userId, seats[], status (PENDING/CONFIRMED/CANCELLED)

- `SeatHold` — temporary hold with TTL

- `User` — user profile

- `Payment` — payment attempts, status

- `Notification` — sending booking confirmations

- `BookingService` — orchestrates holds, payments, confirmation

- `SeatAllocation` / `SeatLockManager` — manages locks (Redis/DB)

### Main flows & patterns

- Seat Hold Flow: client requests seat hold → service checks availability → reserves seats (writes to seat_hold with TTL) → returns hold token.

- Confirm Booking Flow: user pays with hold token → Payment Service returns success → BookingService transitions hold → creates booking (idempotent) → publishes event BookingConfirmed.

- Timeout: Cron/expiry cleans seat_hold and releases seats. Use Redis TTL keys for best-effort auto-release.

- Compensation: If payment fails after booking, use Saga to refund and release seats.

### Design highlights
- Seat holds implemented via distributed store (Redis) with TTL
- Saga-style orchestration for booking → payment → confirmation
- Repository pattern and adapters for Payment
- Caching for read-heavy show listings; seat availability uses Redis for speed

## How to run (dev)
1. `npm install`
2. Start a local Redis (recommended for seat locks)
3. `ts-node src/index.ts` to run example flows


### Design patterns used

- Saga — for multi-step booking/payment workflow.

- Command/Idempotency — booking commands are idempotent.

- Repository — abstraction layer.

- Adapter — for Payment gateway adapters.

- Cache-aside — for show listings & seat map caching.

- Optimistic locking — if using DB rows; or distributed locks (Redis) for seat holds.

### Concurrency strategy

- Best practice: use a Redis SET per show to represent available seats, use SREM to atomically remove seats during hold. Or use WATCH/MULTI/EXEC transactions in Redis or DB transactions in SQL.

- Use TTL keys to auto-expire holds.

- For final durability, move from Redis hold → DB booking in one transactional step (or use a robust two-phase commit / compensate via Saga).

## File structure
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