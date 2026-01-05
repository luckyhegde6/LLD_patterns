# Payment Processing System

## Interview Framing

Design a payment system that can process online payments via a card gateway (Stripe-like) and UPI, handle retries, webhooks, failures, and ensure no duplicate charges.

## Core Responsibilities
```
| Component        | Responsibility                   |
| ---------------- | -------------------------------- |
| PaymentService   | Accepts payment intent           |
| PaymentGateway   | External provider abstraction    |
| PaymentIntent    | Tracks payment lifecycle         |
| WebhookHandler   | Handles async provider callbacks |
| IdempotencyStore | Prevents double charges          |
| RetryPolicy      | Retries transient failures       |
| Ledger           | Records final payment state      |

```

## Key Design Decisions

- Payment Intent first, money later
- Idempotency is mandatory
- Async confirmation via webhooks
- At-least-once delivery, exactly-once effect
- Different flows for Card vs UPI

## Repo Structure (Final)
```
payment-processing/
├── src/
│   ├── core/
│   │   ├── PaymentIntent.ts
│   │   ├── PaymentStatus.ts
│   │   └── PaymentService.ts
│   ├── gateways/
│   │   ├── PaymentGateway.ts
│   │   ├── StripeGateway.ts
│   │   └── UpiGateway.ts
│   ├── webhook/
│   │   └── WebhookHandler.ts
│   ├── store/
│   │   ├── PaymentStore.ts
│   │   └── InMemoryPaymentStore.ts
│   ├── retry/
│   │   └── RetryPolicy.ts
│   └── index.ts
├── tests/
│   ├── payment.test.ts
│   └── idempotency.test.ts
├── DESIGN.md
├── INTERVIEW.md
├── EXPLAINED_LIKE_IM_5.md
├── WHITEBOARD_MOCK.md
├── README.md
└── package.json

```
