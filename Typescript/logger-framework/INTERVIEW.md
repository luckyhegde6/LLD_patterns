# Logger Framework – Interview Explanation

## How I Start
“I separate logging into three concerns:
what to log, how to dispatch, and where to write.”

## Why Async
Logging is I/O heavy and must never block requests.

## Why Sinks
New outputs should not require logger changes.

## Failure Strategy
Logging failure should not crash the application.

## Scaling
- Batch logs
- Add backpressure
- Stream logs to Kafka
