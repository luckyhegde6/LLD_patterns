# Modern Platform LLD Exercises

Companion low-level design prompts for the HLD case studies. These guides define exercises and implementation contracts; they do not claim runnable implementations are already present.

| System | TypeScript | Python | Core focus |
|---|---|---|---|
| YouTube / video platform | [Exercise](../Typescript/youtube/README.md) | [Exercise](../Python/youtube/README.md) | Upload lifecycle, rendition, playback |
| WhatsApp / messaging | [Exercise](../Typescript/whatsapp/README.md) | [Exercise](../Python/whatsapp/README.md) | Conversation ordering, receipts, presence |
| Twitter / X | [Exercise](../Typescript/twitter-x/README.md) | [Exercise](../Python/twitter-x/README.md) | Posts, follow graph, timeline strategy |
| Instagram | [Exercise](../Typescript/instagram/README.md) | [Exercise](../Python/instagram/README.md) | Media assets, stories, feed and visibility |
| Uber / Rapido | [Exercise](../Typescript/rideshare/README.md) | [Exercise](../Python/rideshare/README.md) | Dispatch, trip state machine, location |
| Food delivery | [Exercise](../Typescript/food-delivery/README.md) | [Exercise](../Python/food-delivery/README.md) | Order saga, payment, courier |
| Netflix | [Exercise](../Typescript/netflix/README.md) | [Exercise](../Python/netflix/README.md) | Entitlement, playback, device limits |
| Google Drive | [Exercise](../Typescript/google-drive/README.md) | [Exercise](../Python/google-drive/README.md) | Files, versions, permissions, sync |
| Google Maps | [Exercise](../Typescript/google-maps/README.md) | [Exercise](../Python/google-maps/README.md) | Road graph, routing, traffic |
| Search autocomplete | [Exercise](../Typescript/search-autocomplete/README.md) | [Exercise](../Python/search-autocomplete/README.md) | Prefix index, normalization, top-K |
| Distributed logging | [Exercise](../Typescript/distributed-logging/README.md) | [Exercise](../Python/distributed-logging/README.md) | Batching, ingestion, retention, redaction |
| Notification delivery | [Existing TS](../Typescript/notification-system/README.md) | [Existing Python](../Python/notification-system/README.md) | Preferences, adapters, retries |

## Implementation sequence
1. Draw class and state diagrams before coding.
2. Implement value objects and aggregate invariants.
3. Add application service and ports.
4. Use an in-memory repository and fake clock for deterministic tests.
5. Cover invalid transitions, idempotency and optimistic concurrency.
6. Add external adapters only after domain tests pass.

## Reusable patterns
- **State:** trip, upload, playback and delivery lifecycles.
- **Strategy:** ranking, dispatch, routing, retry and retention.
- **Adapter:** payment, messaging, storage, CDN and provider integrations.
- **Repository:** persistence boundaries.
- **Observer / Domain Events:** projections and notifications.
- **Policy / Specification:** authorization, entitlement and visibility.

Each exercise should remain small enough to finish in a focused weekend session.
