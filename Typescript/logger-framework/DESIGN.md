# Logger Framework – Design

## Goals
- Non-blocking logging
- Multiple output destinations
- Level-based filtering
- Failure isolation

## Architecture
- Logger → API
- Dispatcher → async processing
- Sink → output destination

## Why Async?
- Logging must not slow business logic

## Why Sinks?
- Easy extension: File, HTTP, Kafka

## Failure Handling
- Sink failures are swallowed
- App correctness > logging correctness
