import { InMemoryStore } from "../src/store/InMemoryStore";
import { LFUPolicy } from "../src/policies/LFUPolicy";

test("LFU eviction works", () => {
  const cache = new InMemoryStore<string, number>(2, new LFUPolicy());

  cache.put("a", 1);
  cache.put("b", 2);
  cache.get("a");
  cache.get("a");
  cache.put("c", 3);

  expect(cache.get("b").hit).toBe(false);
  expect(cache.get("a").hit).toBe(true);
});
