export interface EvictionPolicy<K> {
  onGet(key: K): void;
  onPut(key: K): void;
  evictKey(): K | undefined;
  remove(key: K): void;
}

