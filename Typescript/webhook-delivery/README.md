# Webhook Delivery (TypeScript)

HMAC-signed webhook dispatch, stable event identity, bounded exponential retry with jitter and terminal dead-letter state.

Run repository tests with `npm test -- --runInBand`.

HTTP and persistence are interfaces. Production requires durable scheduling, leases/fencing, attempt history, destination allowlists and SSRF protection, secret rotation and controlled replay. Receivers must verify exact request bytes, enforce timestamp tolerance and deduplicate event IDs. HTTP 2xx does not prove downstream work completed.
