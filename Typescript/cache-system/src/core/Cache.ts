import { CacheResult } from "./CacheResult";

export interface Cache<K, V> {
    get(key: K): CacheResult<V>;
    put(key: K, value: V, ttlMs?: number): void;
    size(): number;
}
