# Design Notes

- Delivery identity is `(webhookId, eventId)`; add a unique constraint in durable storage.
- Sign the exact body and timestamp; receiver verifies the same bytes using constant-time comparison.
- Retry network errors and transient statuses with bounded exponential backoff and jitter.
- Classify permanent 4xx responses by provider contract; do not retry malformed endpoints forever.
- A timeout after receiver commit has an unknown outcome. Receiver-side deduplication is mandatory.
- Production: durable queue, lease/fencing, endpoint secret rotation, SSRF-safe URL/IP validation at connect time, per-endpoint concurrency limits and replay audit.
