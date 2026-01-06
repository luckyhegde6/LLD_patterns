# Message Queue — Design

## Goals
- Async communication
- Ordered processing
- Durable storage
- Horizontal scalability

## Architecture
Producer → Broker → Topic → Partition → Consumer

## Delivery Semantics
- At-least-once
- Offset-based replay

## Ordering
- Guaranteed per partition
- Not across partitions

## Scaling
- Add partitions
- Add consumers per group

## Trade-offs
- Duplication possible
- Consumer-managed offsets
