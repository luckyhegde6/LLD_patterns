# Feature Flag System — Design

## Goals
- Runtime feature control
- Safe deployments
- Low latency evaluation

## Architecture
App → Cache → Evaluator → Store

## Evaluation
- Flag enabled?
- Any rule matches?
- Default fallback

## Scaling
- Cache flags in memory
- Periodic refresh
- Central config service

## Failure Handling
- Fail closed (default false)
