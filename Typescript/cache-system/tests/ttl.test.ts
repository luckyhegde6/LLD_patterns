import { InMemoryStore } from "../src/store/InMemoryStore";
import { LRUPolicy } from "../src/policies/LRUPolicy";

test("TTL expiration works", async () => {
    const cache = new InMemoryStore<string, number>(2, new LRUPolicy());

    cache.put("a", 1, 50);
    await new Promise(r => setTimeout(r, 70));

    expect(cache.get("a").hit).toBe(false);
});
