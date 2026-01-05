import { Cache } from "../core/Cache";
import { CacheEntry } from "../core/CacheEntry";
import { CacheResult } from "../core/CacheResult";
import { EvictionPolicy } from "../policies/EvictionPolicy";

export class InMemoryStore<K, V> implements Cache<K, V> {
    private store = new Map<K, CacheEntry<V>>();

    constructor(
        private capacity: number,
        private evictionPolicy: EvictionPolicy<K>
    ) { }

    get(key: K): CacheResult<V> {
        const entry = this.store.get(key);

        if (!entry || entry.isExpired()) {
            this.delete(key);
            return { hit: false };
        }

        this.evictionPolicy.onGet(key);
        return { hit: true, value: entry.value };
    }

    put(key: K, value: V, ttlMs?: number): void {
        if (this.store.size >= this.capacity && !this.store.has(key)) {
            const evict = this.evictionPolicy.evictKey();
            if (evict !== undefined) {
                this.delete(evict);
            }
        }

        const expiresAt = ttlMs ? Date.now() + ttlMs : undefined;
        this.store.set(key, new CacheEntry(value, expiresAt));
        this.evictionPolicy.onPut(key);
    }

    size(): number {
        return this.store.size;
    }

    private delete(key: K) {
        this.store.delete(key);
        this.evictionPolicy.remove(key);
    }
}
