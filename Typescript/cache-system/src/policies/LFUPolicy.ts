import { EvictionPolicy } from "./EvictionPolicy";

export class LFUPolicy<K> implements EvictionPolicy<K> {
    private freq = new Map<K, number>();

    onGet(key: K): void {
        this.freq.set(key, (this.freq.get(key) ?? 0) + 1);
    }

    onPut(key: K): void {
        this.freq.set(key, 1);
    }

    evictKey(): K | undefined {
        let minFreq = Infinity;
        let evictKey: K | undefined;

        for (const [key, count] of this.freq.entries()) {
            if (count < minFreq) {
                minFreq = count;
                evictKey = key;
            }
        }
        return evictKey;
    }

    remove(key: K): void {
        this.freq.delete(key);
    }
}
