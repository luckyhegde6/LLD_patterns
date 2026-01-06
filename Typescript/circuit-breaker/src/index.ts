import { FailureTracker } from "./core/FailureTracker";
import { CircuitBreaker } from "./core/CircuitBreaker";
import { ProtectedExecutor } from "./core/ProtectedExecutor";
import { RetryPolicy } from "./retry/RetryPolicy";

const breaker = new CircuitBreaker(
  new FailureTracker(3),
  2000
);

const retry = new RetryPolicy(2, 100);
const executor = new ProtectedExecutor(breaker);

async function unstableCall() {
  if (Math.random() < 0.7) throw new Error("fail");
  return "success";
}

executor.execute(() =>
  retry.execute(unstableCall)
).then(console.log).catch(console.error);
