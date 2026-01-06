# Elevator System
Interview Framing

Design an elevator system that can handle multiple requests, move efficiently, and scale to multiple elevators.

## Problem Decomposition

### Entities

- Elevator
- Floor
- Request
- Button
- Scheduler
- ElevatorController

### Flow

- Elevator Movement
- Request Handling
- Scheduling
- Elevator Control

## Core Responsibilities

| Component     | Responsibility                 |
| ------------- | ------------------------------ |
| Elevator      | Represents a physical elevator |
| Request       | Floor + direction              |
| Scheduler     | Chooses next floor             |
| Controller    | Accepts requests               |
| State Machine | Controls movement              |

## Elevator States
```
IDLE → MOVING_UP → IDLE
IDLE → MOVING_DOWN → IDLE
```
Invalid transitions are not allowed.

## Key Design Decisions

State machine driven

Direction-aware scheduling

Separation of controller & scheduler

Single-elevator first, extensible to many

Deterministic behavior (easy to test)


## Repo Structure (Final)
```
elevator-system/
├── src/
│   ├── core/
│   │   ├── Elevator.ts
│   │   ├── ElevatorState.ts
│   │   ├── Direction.ts
│   │   ├── Request.ts
│   │   ├── Scheduler.ts
│   │   └── ElevatorController.ts
│   └── index.ts
├── tests/
│   └── elevator.test.ts
├── DESIGN.md
├── INTERVIEW.md
├── ELEVATOR_EXPLAINED_LIKE_IM_5.md
├── ELEVATOR_WHITEBOARD_30SEC_MOCK.md
├── README.md
└── package.json


```