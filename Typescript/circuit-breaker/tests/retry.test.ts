import { RetryPolicy } from "../src/retry/RetryPolicy";

test("retry succeeds after transient failure", async () => {
    let attempts = 0;
    const retry = new RetryPolicy(3, 1);

    await retry.execute(async () => {
        attempts++;
        if (attempts < 2) throw new Error("fail");
    });

    expect(attempts).toBe(2);
});
