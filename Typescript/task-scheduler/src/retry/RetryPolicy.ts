export class RetryPolicy {
    constructor(
        private maxRetries: number,
        private delayMs: number
    ) { }

    canRetry(attempts: number): boolean {
        return attempts < this.maxRetries;
    }

    nextRunTime(attempts: number): number {
        return Date.now() + this.delayMs * attempts;
    }
}
