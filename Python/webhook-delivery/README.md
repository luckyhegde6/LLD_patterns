# Webhook Delivery (Python)

HMAC-signed delivery, stable event identity, bounded exponential backoff with jitter and terminal dead-letter state.

Run: `python -m pytest Python/webhook-delivery/tests -v`

HTTP client and store are protocols. Production needs durable scheduling, receiver dedupe, SSRF controls, secret rotation, attempt history and audited replay.
