# Interview Walkthrough

Discuss orchestration vs choreography, durable checkpoints, idempotency, stale workers, lease fencing, retry budgets and compensation semantics. Failure case: external side effect succeeds but worker crashes before checkpoint. Resolve uncertainty using provider idempotency keys or query-before-retry. Explain parallel DAG extension and human approval state.
