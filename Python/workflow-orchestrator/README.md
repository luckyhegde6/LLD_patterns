# Workflow Orchestrator (Python)

Sequential saga runner with explicit workflow/execution models, checkpoint index and reverse-order compensation.

Run:
```bash
python -m pytest Python/workflow-orchestrator/tests -v
```

The sample is process-local. Production needs durable checkpoints, idempotent handlers, lease/fencing, retry classification and independent compensation status.
