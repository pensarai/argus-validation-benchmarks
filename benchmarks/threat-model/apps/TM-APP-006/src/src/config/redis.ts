import Redis from 'ioredis';

const REDIS_URL = process.env.REDIS_URL || 'redis://localhost:6379';

/**
 * Redis client factory for PubSub transport.
 * Creates separate publisher and subscriber connections
 * as required by Redis PubSub semantics.
 */
export function createRedisClient(label: string): Redis {
  const client = new Redis(REDIS_URL, {
    maxRetriesPerRequest: 3,
    retryStrategy: (times: number) => {
      if (times > 5) {
        console.error(`[redis:${label}] Max retries reached, giving up`);
        return null;
      }
      const delay = Math.min(times * 500, 3000);
      console.log(`[redis:${label}] Retrying in ${delay}ms (attempt ${times})`);
      return delay;
    },
    lazyConnect: false,
  });

  client.on('connect', () => {
    console.log(`[redis:${label}] Connected`);
  });

  client.on('error', (err) => {
    console.error(`[redis:${label}] Error:`, err.message);
  });

  return client;
}
