import { IdempotencyStore } from "./IdempotencyStore";

export class InMemoryIdempotencyStore implements IdempotencyStore {
    private store = new Set<string>();

    isProcessed(key: string): boolean {
        return this.store.has(key);
    }

    markProcessed(key: string): void {
        this.store.add(key);
    }
}
