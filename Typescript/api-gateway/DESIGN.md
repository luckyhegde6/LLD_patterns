# API Gateway — Design

## Goals
- Single entry point
- Cross-cutting concerns
- Backend protection

## Architecture
Client → Gateway → Middleware → Router → Backend

## Middleware
- Auth
- Rate limit
- Logging

## Scaling
- Stateless gateway
- Horizontal scaling
- Shared rate limiter store

## Trade-offs
- Adds latency
- Central policy point
