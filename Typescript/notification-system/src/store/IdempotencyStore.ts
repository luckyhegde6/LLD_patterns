export interface IdempotencyStore {
    isProcessed(key: string): boolean;
    markProcessed(key: string): void;
}
