export class RetryPolicy {
    constructor(private maxRetries: number) { }

    canRetry(attempts: number): boolean {
        return attempts < this.maxRetries;
    }
}
