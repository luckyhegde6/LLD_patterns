export class RetryPolicy {
    constructor(
        private readonly maxAttempts: number,
        private readonly baseDelayMs: number,
        private readonly maxDelayMs = 60_000
    ) {
        if (!Number.isInteger(maxAttempts) || maxAttempts < 1) {
            throw new Error("maxAttempts must be an integer >= 1");
        }
        if (!Number.isFinite(baseDelayMs) || baseDelayMs < 0) {
            throw new Error("baseDelayMs must be >= 0");
        }
        if (!Number.isFinite(maxDelayMs) || maxDelayMs < baseDelayMs) {
            throw new Error("maxDelayMs must be >= baseDelayMs");
        }
    }

    canRetry(attempts: number): boolean {
        return attempts < this.maxAttempts;
    }

    delayForAttempt(attempts: number): number {
        const exponent = Math.max(0, attempts - 1);
        return Math.min(this.maxDelayMs, this.baseDelayMs * (2 ** exponent));
    }

    nextRunTime(attempts: number, now = Date.now()): number {
        return now + this.delayForAttempt(attempts);
    }
}
