# Task Scheduler — Design

## Goals
- Reliable delayed execution
- Retry on failure
- Idempotent execution
- Safe distributed execution

## Architecture
Scheduler → TaskStore → Worker → Executor

## Concurrency
- Lock before execution
- At-least-once execution

## Failure Handling
- Retry with backoff
- Drop or DLQ after max retries

## Scaling
- Multiple workers
- Shared store + distributed lock
