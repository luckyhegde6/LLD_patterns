import { CircuitBreaker } from "../src/core/CircuitBreaker";
import { FailureTracker } from "../src/core/FailureTracker";

test("circuit opens after failures", () => {
    const breaker = new CircuitBreaker(
        new FailureTracker(2),
        1000
    );

    breaker.onFailure();
    breaker.onFailure();

    expect(breaker.getState()).toBe("OPEN");
});
