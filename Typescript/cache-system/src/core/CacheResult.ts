export interface CacheResult<V> {
    hit: boolean;
    value?: V;
}
