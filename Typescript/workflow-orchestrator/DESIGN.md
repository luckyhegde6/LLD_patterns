# Design Notes

- A workflow definition is an ordered, versioned contract.
- Execution stores context, status, current step and completed step IDs.
- A step is checkpointed only after its handler returns.
- Completed reversible steps are compensated in reverse order after a later failure.
- Handlers must be idempotent: a worker can crash after a side effect but before checkpointing.
- This sample is process-local and has no persistence, distributed lease, retries, parallel branches or exactly-once guarantee.

Production interfaces: ExecutionStore, LeaseManager with fencing token, StepExecutor, durable event history and transactional outbox. Track compensation state separately from the original workflow failure.
