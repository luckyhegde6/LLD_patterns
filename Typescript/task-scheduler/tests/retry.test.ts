import { RetryPolicy } from "../src/retry/RetryPolicy";

test("retry backoff increases", () => {
    const retry = new RetryPolicy(3, 100);
    const next = retry.nextRunTime(2);
    expect(next).toBeGreaterThan(Date.now());
});
