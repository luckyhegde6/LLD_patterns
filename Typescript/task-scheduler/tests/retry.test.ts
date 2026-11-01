import { RetryPolicy } from "../src/retry/RetryPolicy";

test("uses capped exponential backoff", () => {
    const retry = new RetryPolicy(4, 100, 500);
    expect(retry.delayForAttempt(1)).toBe(100);
    expect(retry.delayForAttempt(2)).toBe(200);
    expect(retry.delayForAttempt(3)).toBe(400);
    expect(retry.delayForAttempt(4)).toBe(500);
    expect(retry.nextRunTime(2, 1_000)).toBe(1_200);
});

test("stops retrying at configured attempt limit", () => {
    const retry = new RetryPolicy(3, 100);
    expect(retry.canRetry(1)).toBe(true);
    expect(retry.canRetry(2)).toBe(true);
    expect(retry.canRetry(3)).toBe(false);
});
