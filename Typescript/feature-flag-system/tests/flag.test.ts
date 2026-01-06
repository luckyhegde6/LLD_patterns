import { FeatureFlag } from "../src/core/FeatureFlag";
import { FlagEvaluator } from "../src/core/FlagEvaluator";
import { EvaluationContext } from "../src/core/EvaluationContext";

test("flag enabled with no rules", () => {
    const flag = new FeatureFlag("f1", true);
    const evaluator = new FlagEvaluator();

    expect(
        evaluator.evaluate(flag, new EvaluationContext("u1"))
    ).toBe(true);
});

test("flag disabled overrides rules", () => {
    const flag = new FeatureFlag("f2", false);
    const evaluator = new FlagEvaluator();

    expect(
        evaluator.evaluate(flag, new EvaluationContext("u1"))
    ).toBe(false);
});
