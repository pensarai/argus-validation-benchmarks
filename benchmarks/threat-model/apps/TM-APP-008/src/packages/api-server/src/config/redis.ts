import Redis from 'ioredis';
import { config } from './env';
import { logger } from '../utils/logger';

let redisClient: Redis;

/**
 * Initializes the Redis client with reconnect strategy.
 * Provides helper functions for JSON cache operations.
 */
export async function initRedis(): Promise<void> {
  redisClient = new Redis(config.redisUrl, {
    maxRetriesPerRequest: 3,
    retryStrategy(times: number) {
      if (times > 10) {
        logger.error('Redis: max reconnection attempts exceeded');
        return null;
      }
      const delay = Math.min(times * 200, 5000);
      logger.warn(`Redis: reconnecting in ${delay}ms (attempt ${times})`);
      return delay;
    },
    lazyConnect: true,
  });

  redisClient.on('connect', () => logger.info('Redis: connected'));
  redisClient.on('error', (err) => logger.error('Redis: connection error', { error: err.message }));
  redisClient.on('close', () => logger.warn('Redis: connection closed'));

  await redisClient.connect();
}

export function getRedis(): Redis {
  if (!redisClient) {
    throw new Error('Redis not initialized. Call initRedis() first.');
  }
  return redisClient;
}

/**
 * Get a JSON-parsed value from Redis cache.
 */
export async function cacheGet<T>(key: string): Promise<T | null> {
  const raw = await redisClient.get(key);
  if (!raw) return null;
  try {
    return JSON.parse(raw) as T;
  } catch {
    return null;
  }
}

/**
 * Set a JSON-serialized value in Redis cache with optional TTL.
 */
export async function cacheSet(key: string, value: unknown, ttlSeconds: number = 300): Promise<void> {
  await redisClient.set(key, JSON.stringify(value), 'EX', ttlSeconds);
}

/**
 * Delete a cache key.
 */
export async function cacheDelete(key: string): Promise<void> {
  await redisClient.del(key);
}
