import { InMemoryStore } from "../src/stores/InMemoryStore";
import { TokenBucket } from "../src/algorithms/TokenBucket";

test("rate limiter blocks after capacity", async () => {
    const limiter = new TokenBucket(
        new InMemoryStore(),
        2,
        0
    );

    expect((await limiter.allow("u1")).allowed).toBe(true);
    expect((await limiter.allow("u1")).allowed).toBe(true);
    expect((await limiter.allow("u1")).allowed).toBe(false);
});
