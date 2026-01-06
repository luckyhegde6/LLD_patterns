import { EvaluationContext } from "./EvaluationContext";

export interface FlagRule {
    matches(ctx: EvaluationContext): boolean;
}
