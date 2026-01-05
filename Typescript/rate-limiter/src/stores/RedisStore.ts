import Redis from "ioredis";
import { Store } from "./Store";

export class RedisStore implements Store {
    constructor(private redis: Redis) { }

    async get(key: string): Promise<number | null> {
        const value = await this.redis.get(key);
        return value ? Number(value) : null;
    }

    async set(key: string, value: number, ttlMs: number): Promise<void> {
        await this.redis.set(key, value, "PX", ttlMs);
    }

    async incr(key: string, ttlMs: number): Promise<number> {
        const pipeline = this.redis.multi();
        pipeline.incr(key);
        pipeline.pexpire(key, ttlMs);
        const result = await pipeline.exec();
        return Number(result?.[0][1]);
    }
}
