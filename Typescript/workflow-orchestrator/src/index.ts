export type WorkflowStatus = "PENDING" | "RUNNING" | "SUCCEEDED" | "FAILED";
export interface WorkflowStep<T> { id: string; run(context: T): Promise<T>; compensate?(context: T): Promise<T>; }
export interface WorkflowDefinition<T> { id: string; steps: WorkflowStep<T>[]; }
export interface WorkflowExecution<T> { id: string; workflowId: string; status: WorkflowStatus; currentStep: number; context: T; completedSteps: string[]; error?: string; }
export class WorkflowOrchestrator {
 async execute<T>(definition: WorkflowDefinition<T>, execution: WorkflowExecution<T>): Promise<WorkflowExecution<T>> {
  if (execution.workflowId !== definition.id) throw new Error("Workflow definition mismatch");
  if (execution.status !== "PENDING") throw new Error("Execution is not resumable");
  execution.status = "RUNNING";
  try {
   for (let i = execution.currentStep; i < definition.steps.length; i++) {
    const step = definition.steps[i];
    execution.context = await step.run(execution.context);
    execution.completedSteps.push(step.id);
    execution.currentStep = i + 1;
   }
   execution.status = "SUCCEEDED";
  } catch (error) {
   execution.error = error instanceof Error ? error.message : String(error);
   execution.status = "FAILED";
   const byId = new Map(definition.steps.map(step => [step.id, step]));
   for (const id of [...execution.completedSteps].reverse()) {
    const step = byId.get(id);
    if (!step?.compensate) continue;
    try { execution.context = await step.compensate(execution.context); }
    catch { /* Original failure remains primary; persist compensation errors separately in production. */ }
   }
  }
  return execution;
 }
}
