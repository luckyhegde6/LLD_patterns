# Workflow Orchestrator (TypeScript)

Sequential saga/workflow runner with explicit execution state, checkpoint index and reverse-order compensation.

Run repository tests with `npm test -- --runInBand`.

The sample is in-memory. Production requires durable checkpoints, idempotent steps, leases/fencing, bounded retries, independent compensation status and versioned definitions. See DESIGN.md and INTERVIEW.md.
