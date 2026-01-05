export class RetryPolicy {
    constructor(
        private maxRetries: number,
        private baseDelayMs: number
    ) { }

    async retry<T>(fn: () => Promise<T>): Promise<T> {
        let attempt = 0;
        while (true) {
            try {
                return await fn();
            } catch (err) {
                attempt++;
                if (attempt > this.maxRetries) throw err;
                await new Promise(r =>
                    setTimeout(r, this.baseDelayMs * attempt)
                );
            }
        }
    }
}
