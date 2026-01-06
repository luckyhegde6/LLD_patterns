# URL Shortener — Interview Guide

## 30s Pitch
“I generate short URLs using ID-based Base62 encoding,
store mappings, and optimize for read-heavy redirects.”

---

## Interruptions

Interviewer: Why Base62?
You: Compact URLs, URL-safe, deterministic.

Interviewer: Hash vs ID?
You: Hash risks collisions; IDs are simpler and safer.

Interviewer: Hot keys?
You: Cache aggressively; use CDN.

Interviewer: Custom alias?
You: Validate uniqueness before save.

Interviewer: Hardest part?
You: Read scalability.
