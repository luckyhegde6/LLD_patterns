from __future__ import annotations
from dataclasses import dataclass, field
from enum import Enum
from typing import Callable, Generic, TypeVar

T = TypeVar("T")

class WorkflowStatus(str, Enum):
    PENDING = "PENDING"
    RUNNING = "RUNNING"
    SUCCEEDED = "SUCCEEDED"
    FAILED = "FAILED"

@dataclass
class WorkflowStep(Generic[T]):
    step_id: str
    run: Callable[[T], T]
    compensate: Callable[[T], T] | None = None

@dataclass
class WorkflowDefinition(Generic[T]):
    workflow_id: str
    steps: list[WorkflowStep[T]]

@dataclass
class WorkflowExecution(Generic[T]):
    execution_id: str
    workflow_id: str
    context: T
    status: WorkflowStatus = WorkflowStatus.PENDING
    current_step: int = 0
    completed_steps: list[str] = field(default_factory=list)
    error: str | None = None

class WorkflowOrchestrator:
    """In-process sequential saga runner; persistence and distributed leases are adapter boundaries."""
    def execute(self, definition: WorkflowDefinition[T], execution: WorkflowExecution[T]) -> WorkflowExecution[T]:
        if execution.workflow_id != definition.workflow_id:
            raise ValueError("Execution does not match workflow definition")
        if execution.status != WorkflowStatus.PENDING:
            raise ValueError("Execution is not resumable")
        execution.status = WorkflowStatus.RUNNING
        try:
            for index in range(execution.current_step, len(definition.steps)):
                step = definition.steps[index]
                execution.context = step.run(execution.context)
                execution.completed_steps.append(step.step_id)
                execution.current_step = index + 1
            execution.status = WorkflowStatus.SUCCEEDED
        except Exception as exc:
            execution.error = str(exc)
            execution.status = WorkflowStatus.FAILED
            by_id = {step.step_id: step for step in definition.steps}
            for step_id in reversed(execution.completed_steps):
                compensate = by_id[step_id].compensate
                if compensate is None:
                    continue
                try:
                    execution.context = compensate(execution.context)
                except Exception:
                    # Keep original failure; production code records compensation failure separately.
                    continue
        return execution
