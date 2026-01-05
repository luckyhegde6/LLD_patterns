# Task Scheduler — Whiteboard + Mock

## 30s Pitch
“Tasks are persisted with run time.
Workers poll, lock, execute, retry on failure.”

## Diagram Order
1. Task
2. TaskStore
3. Worker
4. Lock
5. Executor

## Mock
Why locks? → prevent duplicates  
Why retries? → transient failures  
Why persistence? → crash safety
