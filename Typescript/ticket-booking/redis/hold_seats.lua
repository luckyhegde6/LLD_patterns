-- KEYS[1] = availableSeatsKey (Redis Set)
-- KEYS[2] = holdKey
-- ARGV[1] = ttlSeconds
-- ARGV[2..n] = seatIds

for i = 2, #ARGV do
  if redis.call("SISMEMBER", KEYS[1], ARGV[i]) == 0 then
    return 0
  end
end

for i = 2, #ARGV do
  redis.call("SREM", KEYS[1], ARGV[i])
end

redis.call("HMSET", KEYS[2], unpack(ARGV, 2))
redis.call("EXPIRE", KEYS[2], ARGV[1])
return 1
