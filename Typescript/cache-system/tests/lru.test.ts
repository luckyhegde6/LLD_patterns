import { InMemoryStore } from "../src/store/InMemoryStore";
import { LRUPolicy } from "../src/policies/LRUPolicy";

test("LRU eviction works", () => {
  const cache = new InMemoryStore<string, number>(2, new LRUPolicy());

  cache.put("a", 1);
  cache.put("b", 2);
  cache.get("a");
  cache.put("c", 3);

  expect(cache.get("b").hit).toBe(false);
  expect(cache.get("a").hit).toBe(true);
});
