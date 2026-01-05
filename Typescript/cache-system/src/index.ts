import { InMemoryStore } from "./store/InMemoryStore";
import { LRUPolicy } from "./policies/LRUPolicy";

const cache = new InMemoryStore<string, string>(
  2,
  new LRUPolicy()
);

cache.put("a", "1");
cache.put("b", "2");
cache.get("a");
cache.put("c", "3"); // evicts "b"

console.log(cache.get("b")); // miss
console.log(cache.get("a")); // hit
