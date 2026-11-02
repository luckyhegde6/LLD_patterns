from src.orchestrator import WorkflowDefinition, WorkflowExecution, WorkflowOrchestrator, WorkflowStep, WorkflowStatus

def test_runs_steps_and_updates_context():
    definition = WorkflowDefinition("demo", [
        WorkflowStep("add", lambda value: value + 1),
        WorkflowStep("double", lambda value: value * 2),
    ])
    result = WorkflowOrchestrator().execute(definition, WorkflowExecution("e1", "demo", 2))
    assert result.status == WorkflowStatus.SUCCEEDED
    assert result.context == 6
    assert result.current_step == 2

def test_compensates_completed_steps_after_failure():
    def fail(_):
        raise RuntimeError("payment failed")
    definition = WorkflowDefinition("saga", [
        WorkflowStep("reserve", lambda ctx: ctx + ["reserved"], lambda ctx: ctx + ["released"]),
        WorkflowStep("charge", fail),
    ])
    result = WorkflowOrchestrator().execute(definition, WorkflowExecution("e2", "saga", []))
    assert result.status == WorkflowStatus.FAILED
    assert result.context == ["reserved", "released"]
    assert result.error == "payment failed"
