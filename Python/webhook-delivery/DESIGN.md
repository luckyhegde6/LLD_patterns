# Design Notes

Unique delivery key: `(webhook_id, event_id)`. Sign timestamp plus exact serialized body; receiver enforces a freshness window and compares signatures in constant time. Unknown outcomes after timeout require receiver deduplication. Production should add durable queue/leases, per-endpoint quotas, URL/IP validation at connection time, secret rotation and controlled replay.
