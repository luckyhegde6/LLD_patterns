# Design Notes

- Definitions are ordered contracts; executions carry context, status and checkpoint index.
- A step is completed only after its handler returns.
- Successful reversible steps are compensated in reverse order after failure.
- Handlers must be idempotent because side effect may complete before checkpoint commit.
- Production requires persistent checkpoints, distributed lease with fencing, retry policy, durable history and separately tracked compensation outcomes.
- No distributed exactly-once guarantee is made by this in-process sample.
