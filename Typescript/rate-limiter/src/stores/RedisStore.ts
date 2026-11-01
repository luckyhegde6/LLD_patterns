import Redis from "ioredis";
import {
    Store,
    TokenBucketDecision,
    TokenBucketOptions
} from "./Store";

const TOKEN_BUCKET_SCRIPT = `
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local now = tonumber(ARGV[3])
local ttlMs = tonumber(ARGV[4])

local tokens = tonumber(redis.call("HGET", KEYS[1], "tokens")) or capacity
local lastRefillAt = tonumber(redis.call("HGET", KEYS[1], "lastRefillAtMs")) or now

-- Protect against backwards clock movement.
local elapsedMs = math.max(0, now - lastRefillAt)
local available = math.min(capacity, tokens + (elapsedMs / 1000) * refillRate)

local allowed = 0
local remainingTokens = available
local retryAfterMs = 0

if available >= 1 then
  allowed = 1
  remainingTokens = available - 1
elseif refillRate > 0 then
  retryAfterMs = math.ceil(((1 - available) / refillRate) * 1000)
end

-- Persist on both allow and deny. This prevents the same refill interval from
-- being credited repeatedly by consecutive denied requests.
redis.call("HSET", KEYS[1],
  "tokens", remainingTokens,
  "lastRefillAtMs", math.max(now, lastRefillAt))
redis.call("PEXPIRE", KEYS[1], ttlMs)

return { allowed, math.floor(remainingTokens), retryAfterMs }
`;

/**
 * Redis implementation of the storage port.
 * The entire read/refill/consume/write transition executes in one Lua script.
 */
export class RedisStore implements Store {
    constructor(private readonly redis: Redis) {}

    async consumeToken(options: TokenBucketOptions): Promise<TokenBucketDecision> {
        const result = await this.redis.eval(
            TOKEN_BUCKET_SCRIPT,
            1,
            options.key,
            options.capacity,
            options.refillRatePerSec,
            options.nowMs,
            options.ttlMs
        ) as [number, number, number];

        const [allowed, remaining, retryAfterMs] = result;
        return {
            allowed: allowed === 1,
            remaining,
            ...(retryAfterMs > 0 ? { retryAfterMs } : {})
        };
    }
}
