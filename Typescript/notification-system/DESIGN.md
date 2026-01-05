# Notification System — Design

## Goals
- Reliable delivery
- Async processing
- No duplicate notifications
- Channel isolation

## Architecture
- Service → Dispatcher → Channels
- Retry policy per channel
- Idempotency per notification+channel

## Failure Handling
- Retry with backoff
- Partial success allowed
- DLQ possible extension

## Scaling
- Queue-based dispatch
- Horizontal workers
- Provider abstraction
