# Payment System — Whiteboard + Mock

## 30s Pitch
“Payment intent first, async gateway, webhook confirmation.”

## Diagram Order
1. PaymentIntent
2. PaymentService
3. Gateway (Stripe / UPI)
4. Webhook
5. Final Status

## Mock
Why intent? → safety  
Why webhook? → async confirmation  
Why idempotency? → no double charge
