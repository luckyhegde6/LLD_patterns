import { RetryPolicy } from "../src/retry/RetryPolicy";

test("retry succeeds after failures", async () => {
    let attempts = 0;
    const retry = new RetryPolicy(3, 1);

    await retry.retry(async () => {
        attempts++;
        if (attempts < 2) throw new Error("fail");
    });

    expect(attempts).toBe(2);
});
