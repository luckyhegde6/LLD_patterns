# URL Shortener — Design

## Goals
- Fast redirects
- Unique short URLs
- Horizontal scalability

## Architecture
ShortenerService → Repository  
RedirectService → Cache → Repository

## Key Generation
- Numeric ID + Base62 encoding
- Avoid hash collisions
- Deterministic, compact keys

## Scaling
- Cache shortKey → longUrl
- DB sharding by shortKey
- CDN for redirects

## Trade-offs
- Sequential IDs leak volume info
- Hashing increases collision risk
