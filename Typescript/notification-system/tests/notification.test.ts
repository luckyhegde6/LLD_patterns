import { InMemoryIdempotencyStore } from "../src/store/InMemoryIdempotencyStore";

test("idempotency prevents duplicates", () => {
    const store = new InMemoryIdempotencyStore();
    store.markProcessed("n1:EMAIL");

    expect(store.isProcessed("n1:EMAIL")).toBe(true);
});
