# Payment Processing — Design

## Goals
- Prevent double charges
- Handle async confirmation
- Support multiple payment methods

## Stripe Flow
Create intent → Charge → Webhook → Confirm

## UPI Flow
Create intent → Collect request → User approval → Webhook

## Key Concepts
- Payment Intent = source of truth
- Webhooks finalize payment
- Idempotency ensures safety

## Scaling
- Stateless service
- Persistent store
- Provider abstraction
