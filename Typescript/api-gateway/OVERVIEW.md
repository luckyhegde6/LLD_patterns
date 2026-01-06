# API Gateway
## Interview Framing

Design an API Gateway that sits in front of multiple backend services and handles routing, authentication, rate limiting, and observability

## 🔥 API Gateway Signals (Use This Line)

“An API gateway is a single entry point for clients to access multiple backend services, providing features like routing, authentication, rate limiting, and observability.”

## Core Responsibilities

| Component      | Responsibility                 |
| -------------- | ------------------------------ |
| Gateway        | Single entry point             |
| Router         | Routes requests to services    |
| AuthMiddleware | Authentication / authorization |
| RateLimiter    | Protects backend services      |
| LoadBalancer   | Chooses backend instance       |
| RequestContext | Carries metadata               |
| Filters        | Cross-cutting concerns         |

## Key Design Decisions

Request pipeline (middleware chain)

Stateless gateway

Pluggable filters

Fail-fast behavior

Separation of routing vs policy

## Key Features

1. Routing: Directs requests to the appropriate backend service based on the request path and method.
2. Authentication: Verifies the client's identity and authorization to access the requested resource.
3. Rate Limiting: Controls the number of requests a client can make to the API gateway within a specified time period.
4. Observability: Provides visibility into the API gateway's behavior and performance, including metrics and logging.

## Key Features

1. Load Balancing: Distributes requests across multiple backend services to improve performance and availability.
2. Caching: Caches responses to reduce latency and improve performance.
3. Security: Provides security features such as encryption, authentication, and authorization.
4. Monitoring: Provides monitoring features such as metrics and logging.

## Implementation

1. Load Balancing: Use a load balancer to distribute requests across multiple backend services.
2. Caching: Use a caching layer to cache responses to reduce latency and improve performance.
3. Security: Use security features such as encryption, authentication, and authorization.
4. Monitoring: Use monitoring features such as metrics and logging.

## Repo Structure (Final)
```

api-gateway/
├── src/
│   ├── core/
│   │   ├── ApiGateway.ts
│   │   ├── Request.ts
│   │   ├── Response.ts
│   │   └── RequestContext.ts
│   ├── routing/
│   │   ├── Router.ts
│   │   └── Route.ts
│   ├── middleware/
│   │   ├── Middleware.ts
│   │   ├── AuthMiddleware.ts
│   │   ├── RateLimitMiddleware.ts
│   │   └── LoggingMiddleware.ts
│   ├── backend/
│   │   ├── BackendService.ts
│   │   └── RoundRobinLoadBalancer.ts
│   └── index.ts
├── tests/
│   └── gateway.test.ts
├── DESIGN.md
├── INTERVIEW.md
├── API_GATEWAY_EXPLAINED_LIKE_IM_5.md
├── API_GATEWAY_WHITEBOARD_30SEC_MOCK.md
├── README.md
└── package.json


```