import { InMemoryStore } from "./stores/InMemoryStore";
import { TokenBucket } from "./algorithms/TokenBucket";

const limiter = new TokenBucket(
    new InMemoryStore(),
    5,
    1 // 1 token/sec
);

(async () => {
    for (let i = 0; i < 7; i++) {
        const res = await limiter.allow("user-123");
        console.log(i, res);
    }
})();
