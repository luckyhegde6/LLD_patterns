# Interview Walkthrough

Clarify sequential vs parallel, durable vs in-memory, external side effects, human approval and cancellation semantics. Model WorkflowDefinition, WorkflowExecution, WorkflowStep, ExecutionStore and LeaseManager.

Walk through step execution, checkpoint boundary, crash-after-side-effect, idempotency key and reverse compensation. Senior signals: distinguish orchestration from choreography; explain outbox/inbox, fencing, stale workers and compensation as a new business operation rather than distributed rollback.

Edge cases: duplicate start, worker crash, timeout with unknown outcome, compensation failure and definition version changed during resume. Follow-up: add parallel DAG branches with dependency scheduling and bounded concurrency.
