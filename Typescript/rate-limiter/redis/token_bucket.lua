-- KEYS[1] = bucketKey
-- KEYS[2] = timestampKey
-- ARGV[1] = capacity
-- ARGV[2] = refillRate
-- ARGV[3] = now (ms)

local tokens = tonumber(redis.call("GET", KEYS[1])) or tonumber(ARGV[1])
local lastTs = tonumber(redis.call("GET", KEYS[2])) or tonumber(ARGV[3])

local elapsed = (ARGV[3] - lastTs) / 1000
local newTokens = math.min(ARGV[1], tokens + elapsed * ARGV[2])

if newTokens < 1 then
  return {0, math.floor(newTokens)}
end

redis.call("SET", KEYS[1], newTokens - 1, "PX", 60000)
redis.call("SET", KEYS[2], ARGV[3], "PX", 60000)

return {1, math.floor(newTokens - 1)}
