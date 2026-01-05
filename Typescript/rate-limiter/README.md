# Rate Limiter — Low Level Design

A production-grade Rate Limiter using:
- Token Bucket algorithm
- In-memory and Redis backends
- Redis Lua for atomicity

## How to Run
```bash
npm install
npm start
npm test
```

## Use Cases

- API Gateway
- Auth throttling
- Abuse prevention

## Patterns Used

- Strategy
- Adapter
- Separation of Concerns