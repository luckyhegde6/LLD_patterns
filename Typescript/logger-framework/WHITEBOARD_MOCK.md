# Logger Framework — Whiteboard + Mock Interview

---

## ⏱ 30-Second Verbal Explanation (Say This)

“A logger captures events without slowing the application.
I separate three things: log creation, async dispatch, and log sinks.
Logs are filtered by level, queued asynchronously, and written to multiple sinks.
If logging fails, the application must continue safely.”

Stop talking here.

---

## 🧠 Whiteboard Diagram (Draw in This Order)

Draw **left to right**, clean and minimal.

1. Box: **Application Code**
   - writes logs

2. Arrow → Box: **Logger**
   - level filtering (DEBUG / INFO / WARN / ERROR)

3. Arrow → Box: **Async Dispatcher**
   - queue
   - non-blocking

4. Arrows → Boxes:
   - **Console Sink**
   - **File Sink**
   - **Remote Sink**

Under Dispatcher, write:
> “Failures swallowed”

Optional if time:
- Draw a queue between Logger and Dispatcher

---

## 🎤 Mock Interview (Interruptions Included)

**Interviewer:** Why async logging?

**You:** Logging is I/O heavy. Blocking logs can slow or crash the application.

---

**Interviewer:** Why not write directly to console or file?

**You:** That tightly couples logging with output. Sinks allow extension without touching core logic.

---

**Interviewer:** What if one sink fails?

**You:** Sink failures are isolated. Logging should never bring down the app.

---

**Interviewer:** What if logs are produced faster than sinks can handle?

**You:** Add batching, backpressure, or bounded queues with drop policies.

---

**Interviewer:** What’s the hardest design decision?

**You:** Balancing reliability with performance — logs are important, but app correctness comes first.

(Interviewer is satisfied.)
