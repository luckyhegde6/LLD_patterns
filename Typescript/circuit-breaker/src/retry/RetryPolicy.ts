export class RetryPolicy {
    constructor(
        private retries: number,
        private delayMs: number
    ) { }

    async execute<T>(fn: () => Promise<T>): Promise<T> {
        let attempt = 0;

        while (true) {
            try {
                return await fn();
            } catch (err) {
                attempt++;
                if (attempt > this.retries) throw err;
                await new Promise(r => setTimeout(r, this.delayMs * attempt));
            }
        }
    }
}
