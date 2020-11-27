import redis from "redis"

export const redisClient = redis.createClient({
  host: process.env.REDIS_HOST as string,
})
