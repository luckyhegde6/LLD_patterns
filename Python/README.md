# Python LLD Patterns

Python implementations of the low-level design exercises in this repository.

## Goals
- Keep each problem independently runnable and testable.
- Prefer small, cohesive classes and explicit interfaces.
- Demonstrate SOLID principles and relevant design patterns without overengineering.
- Include tests and concise interview notes for every implementation.

## Structure

```text
Python/
  README.md
  requirements-dev.txt
  cache-system/
    README.md
    DESIGN.md
    INTERVIEW.md
    src/
      __init__.py
      cache.py
    tests/
      test_cache.py
```

## Setup

From the repository root:

```bash
python -m venv .venv
# Windows PowerShell: .venv\\Scripts\\Activate.ps1
# macOS/Linux: source .venv/bin/activate
pip install -r Python/requirements-dev.txt
python -m pytest Python
```

The examples use the Python standard library at runtime. Pytest is used for tests.

## Implementation order

1. Cache system (LRU, LFU, TTL)
2. Rate limiter (fixed window, sliding window, token bucket)
3. Logger framework
4. Notification system
5. Task scheduler
6. Parking lot
7. Ticket booking
8. API gateway and circuit breaker

Each problem should cover requirements, domain model, interfaces, implementation, tests, trade-offs, and interview discussion.
