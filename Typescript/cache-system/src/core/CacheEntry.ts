export class CacheEntry<V> {
    constructor(
        public value: V,
        public expiresAt?: number,
        public frequency: number = 0
    ) { }

    isExpired(): boolean {
        return this.expiresAt !== undefined && Date.now() > this.expiresAt;
    }
}
