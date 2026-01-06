import { InMemoryFlagStore } from "./store/InMemoryFlagStore";
import { FlagEvaluator } from "./core/FlagEvaluator";
import { FeatureFlag } from "./core/FeatureFlag";
import { EvaluationContext } from "./core/EvaluationContext";

const store = new InMemoryFlagStore();
const evaluator = new FlagEvaluator();

store.save(new FeatureFlag("new-ui", true));

const enabled = evaluator.evaluate(
    store.get("new-ui")!,
    new EvaluationContext("user1")
);

console.log("New UI enabled:", enabled);