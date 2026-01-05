# 🧱 LOGGER FRAMEWORK (Async, Levels, Sinks)

This is a classic senior LLD problem. It looks simple; it’s not. Interviewers use it to see if you understand decoupling, backpressure, extensibility, and failure isolation.

---

## 1️⃣ Problem Statement (Interview Version)

Design a logging framework that:

- Supports log levels (DEBUG, INFO, WARN, ERROR)
- Is asynchronous (non-blocking)
- Can write logs to multiple destinations (console, file, remote)
- Is extensible and testable
- Does not crash the app if logging fails

## 2️⃣ Final Repo Structure
```
logger-framework/
├── src/
│   ├── core/
│   │   ├── Logger.ts
│   │   ├── LogLevel.ts
│   │   └── LogMessage.ts
│   ├── sinks/
│   │   ├── LogSink.ts
│   │   ├── ConsoleSink.ts
│   │   └── MemorySink.ts
│   ├── dispatcher/
│   │   └── AsyncDispatcher.ts
│   └── index.ts
├── tests/
│   ├── logger.test.ts
│   └── level-filter.test.ts
├── DESIGN.md
├── INTERVIEW.md
├── README.md
└── package.json
```
