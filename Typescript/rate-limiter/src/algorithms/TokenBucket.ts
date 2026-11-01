import { RateLimitResult } from "../core/RateLimitResult";
import { Store } from "../stores/Store";

export interface Clock {
    now(): number;
}

export class SystemClock implements Clock {
    now(): number {
        return Date.now();
    }
}

/**
 * Token Bucket algorithm.
 *
 * The algorithm delegates state transition to the store so that each
 * implementation can guarantee atomicity appropriate to its environment.
 */
export class TokenBucket {
    constructor(
        private readonly store: Store,
        private readonly capacity: number,
        private readonly refillRatePerSec: number,
        private readonly clock: Clock = new SystemClock(),
        private readonly ttlMs = 60_000
    ) {
        if (!Number.isFinite(capacity) || capacity < 1) {
            throw new Error("capacity must be a finite number >= 1");
        }
        if (!Number.isFinite(refillRatePerSec) || refillRatePerSec < 0) {
            throw new Error("refillRatePerSec must be a finite number >= 0");
        }
        if (!Number.isFinite(ttlMs) || ttlMs <= 0) {
            throw new Error("ttlMs must be a finite number > 0");
        }
    }

    async allow(key: string): Promise<RateLimitResult> {
        if (!key || !key.trim()) {
            throw new Error("key must be a non-empty string");
        }

        const decision = await this.store.consumeToken({
            key: `bucket:${key}`,
            capacity: this.capacity,
            refillRatePerSec: this.refillRatePerSec,
            nowMs: this.clock.now(),
            ttlMs: this.ttlMs
        });

        return {
            allowed: decision.allowed,
            remaining: decision.remaining,
            ...(decision.retryAfterMs === undefined
                ? {}
                : { retryAfterMs: decision.retryAfterMs })
        };
    }
}
