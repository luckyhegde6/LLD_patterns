# Rate Limiter – Design

## Problem
Prevent abuse by limiting how frequently an entity can perform actions.

## Algorithms
- Token Bucket (chosen): allows bursts, smooth refill
- Sliding Window (alternative)

## Key Decisions
- Separate algorithm from storage
- Redis for distributed correctness
- Lua scripts for atomicity

## Trade-offs
| Approach | Pros | Cons |
|-------|------|------|
In-memory | Fast | Not distributed |
Redis | Scalable | Network cost |
DB | Durable | Slow |

## Scaling
- Hash key by user or IP
- Use Redis Cluster
- Add local LRU cache for hot keys
