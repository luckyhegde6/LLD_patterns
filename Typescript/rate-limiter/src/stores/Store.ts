export interface Store {
    get(key: string): Promise<number | null>;
    set(key: string, value: number, ttlMs: number): Promise<void>;
    incr(key: string, ttlMs: number): Promise<number>;
}
