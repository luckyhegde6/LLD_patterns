# Distributed ID Generator — Design

## Goals
- Global uniqueness
- Time-sortable IDs
- No coordination

## ID Layout
timestamp | nodeId | sequence

## Clock Handling
- If clock moves backward → fail or wait
- Sequence prevents collision within same ms

## Scaling
- Add more nodes
- Increase nodeId bits
- Increase sequence bits

## Trade-offs
- Depends on clock accuracy
- IDs leak time info
