-- KEYS[1] = availableSeatsKey
-- KEYS[2] = holdKey

local seats = redis.call("HKEYS", KEYS[2])
for _, seat in ipairs(seats) do
  redis.call("SADD", KEYS[1], seat)
end

redis.call("DEL", KEYS[2])
return 1
