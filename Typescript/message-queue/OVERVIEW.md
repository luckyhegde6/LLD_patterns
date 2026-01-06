# Message Queue (Kafka-lite)
## Interview Framing

Design a message queue that allows producers to publish messages and consumers to process them asynchronously with ordering, durability, and scalability.

## Core Responsibilities

| Component     | Responsibility                 |
| ------------- | ------------------------------ |
| Producer      | Publishes messages             |
| Broker        | Stores messages durably        |
| Topic         | Logical stream of messages     |
| Partition     | Ordered log within a topic     |
| Consumer      | Reads messages                 |
| Offset        | Tracks consumer progress       |
| ConsumerGroup | Coordinates multiple consumers |

## Key Design Decisions

- Append-only log
- Partitioned topics
- Pull-based consumption
- At-least-once delivery
- Offset-based replay
- Consumer-managed offsets

## Key Features

- Ordering
- Durability
- Scalability

## Signals

- Kafka-style partitioning
- Leader/follower replication
- Consumer groups
- Exactly-once processing

## Repo Structure (Final)
```
message-queue/
├── src/
│   ├── core/
│   │   ├── Message.ts
│   │   ├── Topic.ts
│   │   ├── Partition.ts
│   │   ├── Broker.ts
│   │   ├── Producer.ts
│   │   ├── Consumer.ts
│   │   └── ConsumerGroup.ts
│   └── index.ts
├── tests/
│   └── queue.test.ts
├── DESIGN.md
├── INTERVIEW.md
├── MESSAGE_QUEUE_EXPLAINED_LIKE_IM_5.md
├── MESSAGE_QUEUE_WHITEBOARD_30SEC_MOCK.md
├── README.md
└── package.json
```

## Implementation Details

### Message

- Payload
- Timestamp
- Metadata

### Topic

- Name
- Partitions
- Configuration

### Partition

- Leader
- Followers
- Offset

### Broker

- Storage
- Replication
- Load balancing

### Producer

- Message validation
- Message serialization
- Message delivery

### Consumer

- Message deserialization
- Message processing
- Offset management

### ConsumerGroup

- Group management
- Load balancing
- Offset management

### Offset

- Message offset
- Consumer offset
- Group offset
