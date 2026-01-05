# Notification System - LLD

## Problem (LLD framing)

Design a notification system that:

- Sends Email / SMS / Push
- Is async
- Supports retries with backoff
- Guarantees no duplicate delivery
- Handles partial failures
- Is extensible for new channels

## Core Responsibilities
``` markdown

| Component           | Responsibility             |
| ------------------- | -------------------------- |
| NotificationService | Accept notification intent |
| Dispatcher          | Orchestrate async delivery |
| Channel             | Send via Email/SMS/Push    |
| RetryPolicy         | Control retries & backoff  |
| IdempotencyStore    | Prevent duplicates         |
| Queue               | Buffer & retry work        |
```

## Key Design Decisions

- Async by default
- Channel isolation (email failure ≠ SMS failure)
- Idempotency per (notificationId + channel)
- Retry + DLQ
- At-least-once processing with de-duplication

## Repo Structure (Final)
```
notification-system/
├── src/
│   ├── core/
│   │   ├── Notification.ts
│   │   ├── NotificationStatus.ts
│   │   └── NotificationService.ts
│   ├── channels/
│   │   ├── NotificationChannel.ts
│   │   ├── EmailChannel.ts
│   │   ├── SmsChannel.ts
│   │   └── PushChannel.ts
│   ├── dispatcher/
│   │   └── NotificationDispatcher.ts
│   ├── retry/
│   │   └── RetryPolicy.ts
│   ├── store/
│   │   ├── IdempotencyStore.ts
│   │   └── InMemoryIdempotencyStore.ts
│   └── index.ts
├── tests/
│   ├── notification.test.ts
│   └── retry.test.ts
├── DESIGN.md
├── INTERVIEW.md
├── README.md
└── package.json

```