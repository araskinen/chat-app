import { Redis } from 'ioredis'
import { env } from './env'

// Two separate clients are required by @socket.io/redis-adapter
export const pubClient  = new Redis(env.redisUrl, { lazyConnect: true })
export const subClient  = pubClient.duplicate()

export async function connectRedis() {
  await Promise.all([pubClient.connect(), subClient.connect()])
  console.log('✅ Redis connected')
}
