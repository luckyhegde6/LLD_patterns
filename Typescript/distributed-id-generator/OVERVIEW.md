# Distributed ID Generator (Snowflake-style)
## Interview Framing

Design a system that generates globally unique, time-ordered IDs at very high scale without coordination between machines.

## Core Requirements

### Functional

Generate unique IDs across machines

IDs must be sortable by time

Very high throughput (millions/sec)

No central bottleneck

### Non-Functional

Low latency

Works in distributed setup

Handles clock drift gracefully

### Snowflake-Style ID Structure
``` 
| timestamp | machineId | sequence |

```
Example (64-bit):

41 bits → timestamp (ms)

10 bits → machine / node ID

12 bits → sequence (per ms)

## Core Responsibilities

| Component   | Responsibility                    |
| ----------- | --------------------------------- |
| IDGenerator | Generates IDs                     |
| Clock       | Provides current time             |
| Sequence    | Ensures uniqueness within same ms |
| NodeId      | Identifies machine                |
| Epoch       | Custom start time                 |

## Key Design Decisions

Time-based ordering

Per-node sequence

No network calls

Wait on clock rollback

Stateless except last timestamp

## Repo Structure (Final)
```
distributed-id-generator/
├── src/
│   ├── core/
│   │   ├── SnowflakeConfig.ts
│   │   ├── SnowflakeGenerator.ts
│   │   └── Clock.ts
│   └── index.ts
├── tests/
│   └── snowflake.test.ts
├── DESIGN.md
├── INTERVIEW.md
├── ID_GENERATOR_EXPLAINED_LIKE_IM_5.md
├── ID_GENERATOR_WHITEBOARD_30SEC_MOCK.md
├── README.md
└── package.json

```