# Feature Flag System
## Interview Framing

Design a feature flag system that allows enabling/disabling features at runtime, supports user targeting, percentage rollouts, and safe fallbacks.

## Core Responsibilities

| Component     | Responsibility            |
| ------------- | ------------------------- |
| FeatureFlag   | Flag definition           |
| FlagRule      | Targeting / rollout logic |
| FlagStore     | Persistent storage        |
| FlagEvaluator | Runtime evaluation        |
| Context       | User / request attributes |
| Cache         | Low-latency reads         |

## Trade-offs

## Key Design Decisions

Read-heavy, write-light

Evaluation at runtime

Rules over hardcoded logic

Fail-safe defaults

Cache-first, store-backed

## Implementation

- Feature flag storage
- Runtime evaluation
- User targeting
- Percentage rollouts
- Safe fallbacks

## Repo Structure (Final)
```
feature-flag-system/
├── src/
│   ├── core/
│   │   ├── FeatureFlag.ts
│   │   ├── FlagRule.ts
│   │   ├── EvaluationContext.ts
│   │   └── FlagEvaluator.ts
│   ├── store/
│   │   ├── FlagStore.ts
│   │   └── InMemoryFlagStore.ts
│   ├── cache/
│   │   └── InMemoryCache.ts
│   └── index.ts
├── tests/
│   └── flag.test.ts
├── DESIGN.md
├── INTERVIEW.md
├── FEATURE_FLAG_EXPLAINED_LIKE_IM_5.md
├── FEATURE_FLAG_WHITEBOARD_30SEC_MOCK.md
├── README.md
└── package.json

```