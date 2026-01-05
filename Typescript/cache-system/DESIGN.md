# Cache System – Design

## Goals
- Fast access (O(1))
- Pluggable eviction strategies
- TTL-based expiry
- Deterministic eviction

## Architecture
- Cache core orchestrates
- EvictionPolicy decides removal
- Store manages memory

## Eviction Policies
- LRU → temporal locality
- LFU → frequency locality

## TTL Strategy
- Lazy eviction on access
- Avoid background threads

## Complexity
| Operation | Time |
|--------|------|
get | O(1) |
put | O(1) |

## Extensions
- Redis backend
- Write-through cache
- Cache warming
