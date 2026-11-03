# Maps and Navigation — LLD Exercise

GeoPoint, RoadSegment, RoadGraph, TileKey, RouteRequest, Route, RouteLeg, TrafficObservation and Place. Provide Dijkstra/A* routing strategy and graph versions.

## Design goals
- Keep domain rules independent from HTTP, database and provider adapters.
- Express invariants in constructors and intent-revealing methods.
- Use interfaces for real variation points; avoid speculative abstractions.
- Make state transitions explicit and reject invalid transitions.
- Treat concurrency and idempotency as part of the contract.

## Class diagram
```mermaid
classDiagram
 class ApplicationService {
  +execute(command) Result
 }
 class Repository {
  <<interface>>
  +getById(id) Aggregate
  +save(aggregate) void
 }
 class DomainAggregate {
  +id string
  +version number
  +state State
  +transition(next) void
  +validateInvariant() void
 }
 class Policy {
  <<interface>>
  +decide(input) Decision
 }
 class EventPublisher {
  <<interface>>
  +publish(event) void
 }
 ApplicationService --> Repository
 ApplicationService --> Policy
 ApplicationService --> EventPublisher
 ApplicationService --> DomainAggregate
```

## State lifecycle
```mermaid
stateDiagram-v2
 [*] --> CREATED
 CREATED --> ACTIVE: validated command
 ACTIVE --> COMPLETED: success
 ACTIVE --> FAILED: terminal failure
 FAILED --> ACTIVE: permitted retry
 COMPLETED --> [*]
```

Adapt state labels to the domain lifecycle. Document forbidden transitions and terminal states.

## Command flow
1. Validate command shape and actor identity.
2. Load aggregate; check optimistic version and idempotency key.
3. Apply a domain method that enforces invariants.
4. Persist aggregate and outbox event atomically.
5. Publish asynchronously; consumers deduplicate by event ID.

## Python implementation direction
Use dataclasses or explicit classes, Enum state types, Protocol ports and injected repositories, clock and provider clients. Use domain-specific errors.

Suggested files: `domain.py, service.py, ports.py, tests/test_domain.py`.

## Required tests
- Happy path and each allowed transition.
- Invalid transition and invariant violation.
- Duplicate command/idempotency replay.
- Concurrent update (optimistic version conflict).
- Provider timeout/retry boundary.
- Expiry, ordering, malformed input and authorization boundary tests.

## Interview prompts
- Which object owns the invariant and why?
- What should be an entity, value object, policy or service?
- Where is State, Strategy, Adapter, Observer or Repository justified?
- How do you prevent two concurrent commands from both winning?
- What is the smallest design that satisfies the requirements?
