# Elevator System — Design

## Goals
- Efficient movement
- Clear state transitions
- Deterministic scheduling

## Architecture
Controller → Scheduler → Elevator

## Scheduling
- Separate up/down queues
- Direction-aware servicing

## Concurrency
- Single elevator = sequential
- Multi-elevator → central dispatcher

## Scaling
- Add multiple elevators
- Assign requests by proximity
