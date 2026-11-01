import { TokenBucket, Clock } from "../src/algorithms/TokenBucket";
import { InMemoryStore } from "../src/stores/InMemoryStore";

class FakeClock implements Clock {
    constructor(private currentTimeMs = 0) {}
    now(): number { return this.currentTimeMs; }
    advance(ms: number): void { this.currentTimeMs += ms; }
    set(ms: number): void { this.currentTimeMs = ms; }
}

describe("TokenBucket with InMemoryStore", () => {
    test("allows requests up to capacity and then denies", async () => {
        const clock = new FakeClock();
        const limiter = new TokenBucket(new InMemoryStore(), 2, 0, clock);

        expect(await limiter.allow("user-1")).toMatchObject({ allowed: true, remaining: 1 });
        expect(await limiter.allow("user-1")).toMatchObject({ allowed: true, remaining: 0 });
        expect(await limiter.allow("user-1")).toMatchObject({ allowed: false, remaining: 0 });
    });

    test("refills fractionally over elapsed time", async () => {
        const clock = new FakeClock();
        const limiter = new TokenBucket(new InMemoryStore(), 2, 2, clock);

        await limiter.allow("user-1");
        await limiter.allow("user-1");
        expect(await limiter.allow("user-1")).toMatchObject({ allowed: false, retryAfterMs: 500 });

        clock.advance(500);
        expect(await limiter.allow("user-1")).toMatchObject({ allowed: true, remaining: 0 });
    });

    test("does not create tokens when the clock moves backwards", async () => {
        const clock = new FakeClock(10_000);
        const limiter = new TokenBucket(new InMemoryStore(), 1, 1, clock);

        await limiter.allow("user-1");
        clock.set(5_000);
        expect(await limiter.allow("user-1")).toMatchObject({ allowed: false });
    });

    test("isolates buckets by key", async () => {
        const limiter = new TokenBucket(new InMemoryStore(), 1, 0, new FakeClock());

        expect((await limiter.allow("user-1")).allowed).toBe(true);
        expect((await limiter.allow("user-2")).allowed).toBe(true);
        expect((await limiter.allow("user-1")).allowed).toBe(false);
    });

    test("rejects invalid configuration and empty keys", async () => {
        expect(() => new TokenBucket(new InMemoryStore(), 0, 1)).toThrow();
        expect(() => new TokenBucket(new InMemoryStore(), 1, -1)).toThrow();

        const limiter = new TokenBucket(new InMemoryStore(), 1, 1);
        await expect(limiter.allow(" ")).rejects.toThrow("key must be a non-empty string");
    });

    test("serializes many concurrent calls within one process", async () => {
        const limiter = new TokenBucket(new InMemoryStore(), 5, 0, new FakeClock());
        const results = await Promise.all(
            Array.from({ length: 50 }, () => limiter.allow("same-user"))
        );

        expect(results.filter(result => result.allowed)).toHaveLength(5);
        expect(results.filter(result => !result.allowed)).toHaveLength(45);
    });
});
