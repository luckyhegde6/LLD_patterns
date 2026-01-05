# Parking Lot System — LLD
## High-level summary

A modular Parking Lot system managing multiple levels, entrances/exits, different vehicle sizes, ticketing, billing and optional reservations. Designed for single-machine or distributed deployment (via replacing in-memory stores with DB/Redis).

## Overview
This project delivers a low-level design for a Parking Lot System with modular components: levels, spots, vehicles, ticketing, gates, pricing policies and spot allocation strategies. Implemented in TypeScript with pluggable repositories for persistence.

## Design principles
- Single Responsibility per class
- Dependency Injection via repository/service interfaces
- Strategy pattern for pricing & allocation
- Repositories abstract storage for easy DB swaps
- Concurrency-safe allocation (recommend Redis locks or DB transactions in production)

## How to run (dev)
1. `npm install`
2. `npm run build` (if compiled) or `ts-node src/index.ts`
3. Play with the `ParkingManager` entry points in `src/index.ts`

## File structure
- `/models` domain objects
- `/services` manager & strategies
- `/repositories` abstract interfaces & in-memory impl
- `/controllers` gate endpoints

## Assumptions
- Spot sizes map to VehicleType one-to-many (one vehicle type may fit multiple spot sizes)
- Billing is simple hourly-based by default but easily pluggable
- Reservations are optional and treated as separate TTL-locked reservations

## Scaling notes
- Use Redis distributed locks or DB `FOR UPDATE` for allocation in distributed mode.
- Use CQRS for heavy read load (availability dashboard).
- Event-driven for asynchronous billing and reporting.

## Next steps
- Add persistence adapters (Postgres, Mongo)
- Add Reservation microservice (for advanced flows)
- Add metrics (Prometheus) and health checks

---

# Parking Lot System — Low Level Design

## Interview Problem
Design a Parking Lot system that can support:
- Multiple vehicle types
- Different parking spot sizes
- Ticketing, billing, and exits
- Scalability and concurrency

This implementation demonstrates clean LLD principles, extensibility, and production-oriented thinking.

---

## Requirements Breakdown

### Functional
- Park and unpark vehicles
- Generate tickets
- Calculate parking fee
- Support multiple vehicle and spot types

### Non-Functional
- Thread-safe spot allocation
- Extensible pricing strategies
- Easy swap of in-memory → DB → Redis
- Testable and readable design

---

## Core Design Decisions

### 1. Separation of Concerns
- Models → Pure domain objects
- Services → Business orchestration
- Repositories → Persistence abstraction

### 2. Strategy Pattern
- PricingPolicy allows adding:
  - Hourly pricing
  - Flat pricing
  - Weekend surge pricing

### 3. Repository Pattern
- SpotRepository and TicketRepository
- Enables DB / Redis swap without touching business logic

---

## How to Explain This in an Interview

**Step 1: Clarify scope**
> “I’ll design a single parking lot with multiple spots, pricing strategies, and safe allocation.”

**Step 2: Start with entities**
- Vehicle
- ParkingSpot
- Ticket

**Step 3: Introduce extensibility**
> “Pricing and allocation are strategies so business rules don’t leak into core logic.”

**Step 4: Talk about scaling**
- In-memory → DB transaction
- Distributed locks using Redis
- Event-driven billing if required

---

## Trade-offs
- In-memory repos are fast but volatile
- DB locks provide correctness but reduce throughput
- Redis locks provide best balance at scale

---

## How to Run
```bash
npm install
npm start
npm test
```

## Follow-up Enhancements

Reservation system

Multi-level parking

Admin dashboards

Metrics & alerts

