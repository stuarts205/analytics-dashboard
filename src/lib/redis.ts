import { Redis } from '@upstash/redis'
export const redis = new Redis({
  url: 'https://fit-ox-90098.upstash.io',
  token: process.env.REDIS_KEY!,
})

await redis.set("foo", "bar");
await redis.get("foo");