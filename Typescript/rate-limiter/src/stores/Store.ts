export interface TokenBucketState {
    tokens: number;
    lastRefillAtMs: number;
}

export interface TokenBucketOptions {
    key: string;
    capacity: number;
    refillRatePerSec: number;
    nowMs: number;
    ttlMs: number;
}

export interface TokenBucketDecision {
    allowed: boolean;
    remaining: number;
    retryAfterMs?: number;
}

/**
 * Storage port for rate-limiter state.
 *
 * consumeToken must be atomic: concurrent callers for the same key must
 * observe a single ordered sequence of token consumption decisions.
 */
export interface Store {
    consumeToken(options: TokenBucketOptions): Promise<TokenBucketDecision>;
}
