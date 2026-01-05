import { Store } from "../stores/Store";
import { RateLimitResult } from "../core/RateLimitResult";

export class TokenBucket {
    constructor(
        private store: Store,
        private capacity: number,
        private refillRatePerSec: number
    ) { }

    async allow(key: string): Promise<RateLimitResult> {
        const now = Date.now();
        const bucketKey = `bucket:${key}`;
        const lastRefillKey = `bucket:${key}:ts`;

        const tokens = (await this.store.get(bucketKey)) ?? this.capacity;
        const lastRefill = (await this.store.get(lastRefillKey)) ?? now;

        const elapsed = (now - lastRefill) / 1000;
        const newTokens = Math.min(
            this.capacity,
            tokens + elapsed * this.refillRatePerSec
        );

        if (newTokens < 1) {
            return { allowed: false, remaining: 0, retryAfterMs: 1000 };
        }

        await this.store.set(bucketKey, newTokens - 1, 60000);
        await this.store.set(lastRefillKey, now, 60000);

        return {
            allowed: true,
            remaining: Math.floor(newTokens - 1)
        };
    }
}
