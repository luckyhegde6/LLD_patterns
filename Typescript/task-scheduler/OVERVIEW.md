# Task Scheduler / Cron System

## Interview Framing

Design a system that can schedule tasks to run at a specific time or repeatedly (cron), execute them reliably, retry on failure, and avoid duplicate execution in a distributed system.

## Core Responsibilities
```
| Component   | Responsibility                |
| ----------- | ----------------------------- |
| Scheduler   | Accepts task definitions      |
| TaskStore   | Persists tasks                |
| Executor    | Executes task logic           |
| Clock       | Determines when tasks are due |
| RetryPolicy | Handles failures              |
| LockManager | Prevents duplicate execution  |
| Worker      | Polls and executes due tasks  |

```

## Key Design Decisions
Persistent tasks (crash-safe)

Idempotent execution

Retry with backoff

Distributed lock before execution

At-least-once execution + de-duplication

## Final Repo Structure
```
task-scheduler/
├── src/
│   ├── core/
│   │   ├── Task.ts
│   │   ├── TaskStatus.ts
│   │   └── Scheduler.ts
│   ├── store/
│   │   ├── TaskStore.ts
│   │   └── InMemoryTaskStore.ts
│   ├── executor/
│   │   └── TaskExecutor.ts
│   ├── retry/
│   │   └── RetryPolicy.ts
│   │   ├── LockManager.ts
│   │   └── InMemoryLockManager.ts
│   └── worker/
│       └── Worker.ts
├── tests/
│   ├── scheduler.test.ts
│   └── retry.test.ts
├── DESIGN.md
├── INTERVIEW.md
├── TASK_SCHEDULER_EXPLAINED_LIKE_IM_5.md
├── TASK_SCHEDULER_WHITEBOARD_30SEC_MOCK.md
├── README.md
└── package.json

```