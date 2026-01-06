import { FeatureFlag } from "./FeatureFlag";
import { EvaluationContext } from "./EvaluationContext";

export class FlagEvaluator {
    evaluate(flag: FeatureFlag, ctx: EvaluationContext): boolean {
        if (!flag.enabled) return false;
        if (flag.rules.length === 0) return true;

        return flag.rules.some(rule => rule.matches(ctx));
    }
}
