import { WorkflowOrchestrator, type WorkflowDefinition, type WorkflowExecution } from "../src";

describe("WorkflowOrchestrator", () => {
 it("executes sequential steps and advances checkpoints", async () => {
  const definition: WorkflowDefinition<{ value: number }> = { id: "demo", steps: [
   { id: "increment", run: async c => ({ value: c.value + 1 }) },
   { id: "double", run: async c => ({ value: c.value * 2 }) }
  ]};
  const execution: WorkflowExecution<{ value: number }> = { id: "e1", workflowId: "demo", status: "PENDING", currentStep: 0, context: { value: 2 }, completedSteps: [] };
  const result = await new WorkflowOrchestrator().execute(definition, execution);
  expect(result.status).toBe("SUCCEEDED"); expect(result.context.value).toBe(6); expect(result.currentStep).toBe(2);
 });
 it("compensates completed steps in reverse order after failure", async () => {
  const definition: WorkflowDefinition<string[]> = { id: "saga", steps: [
   { id: "reserve", run: async c => [...c, "reserved"], compensate: async c => [...c, "released"] },
   { id: "charge", run: async () => { throw new Error("payment failed"); } }
  ]};
  const execution: WorkflowExecution<string[]> = { id: "e2", workflowId: "saga", status: "PENDING", currentStep: 0, context: [], completedSteps: [] };
  const result = await new WorkflowOrchestrator().execute(definition, execution);
  expect(result.status).toBe("FAILED"); expect(result.context).toEqual(["reserved", "released"]); expect(result.error).toBe("payment failed");
 });
});
