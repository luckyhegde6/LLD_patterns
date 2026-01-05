import { EvictionPolicy } from "./EvictionPolicy";

export class LRUPolicy<K> implements EvictionPolicy<K> {
    private order = new Map<K, null>();

    onGet(key: K): void {
        this.order.delete(key);
        this.order.set(key, null);
    }

    onPut(key: K): void {
        this.order.set(key, null);
    }

    evictKey(): K | undefined {
        return this.order.keys().next().value;
    }

    remove(key: K): void {
        this.order.delete(key);
    }
}
