export class InMemoryCache<T> {
    private cache = new Map<string, T>();

    get(key: string): T | undefined {
        return this.cache.get(key);
    }

    set(key: string, value: T) {
        this.cache.set(key, value);
    }
}
