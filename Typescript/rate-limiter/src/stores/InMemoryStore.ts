import {
    Store,
    TokenBucketDecision,
    TokenBucketOptions,
    TokenBucketState
} from "./Store";

type Entry = {
    state: TokenBucketState;
    expiresAt: number;
};

/**
 * Single-process store. JavaScript executes each synchronous state transition
 * without interleaving; no await occurs between reading and writing the entry.
 *
 * This is atomic only within one Node.js process, not across multiple instances.
 */
export class InMemoryStore implements Store {
    private readonly buckets = new Map<string, Entry>();

    async consumeToken(options: TokenBucketOptions): Promise<TokenBucketDecision> {
        const { key, capacity, refillRatePerSec, nowMs, ttlMs } = options;
        const existing = this.buckets.get(key);
        const entry = existing && nowMs <= existing.expiresAt ? existing : undefined;

        const previous: TokenBucketState = entry?.state ?? {
            tokens: capacity,
            lastRefillAtMs: nowMs
        };

        // Clamp negative elapsed time to zero to tolerate clock movement backwards.
        const elapsedSeconds = Math.max(0, nowMs - previous.lastRefillAtMs) / 1000;
        const available = Math.min(
            capacity,
            previous.tokens + elapsedSeconds * refillRatePerSec
        );

        const allowed = available >= 1;
        const tokens = allowed ? available - 1 : available;
        const retryAfterMs = allowed
            ? undefined
            : refillRatePerSec > 0
                ? Math.ceil(((1 - available) / refillRatePerSec) * 1000)
                : undefined;

        this.buckets.set(key, {
            state: {
                tokens,
                // Persist the observation time even on denial so refill is not
                // counted more than once on the next request.
                lastRefillAtMs: Math.max(nowMs, previous.lastRefillAtMs)
            },
            expiresAt: nowMs + ttlMs
        });

        return {
            allowed,
            remaining: Math.floor(tokens),
            ...(retryAfterMs === undefined ? {} : { retryAfterMs })
        };
    }
}
