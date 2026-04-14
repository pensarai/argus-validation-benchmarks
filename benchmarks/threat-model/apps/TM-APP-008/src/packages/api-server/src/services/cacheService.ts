import { cacheGet, cacheSet, cacheDelete } from '../config/redis';
import { logger } from '../utils/logger';

/**
 * Redis-based caching layer using cache-aside pattern.
 * Provides type-safe cache operations with consistent key prefixes and TTLs.
 */

const PREFIXES = {
  user: 'cache:user:',
  project: 'cache:project:',
  org: 'cache:org:',
  tasks: 'cache:tasks:',
} as const;

const DEFAULT_TTL = 300; // 5 minutes
const USER_TTL = 600; // 10 minutes
const PROJECT_TTL = 300; // 5 minutes

class CacheService {
  async getUserCache(userId: string) {
    const key = `${PREFIXES.user}${userId}`;
    const cached = await cacheGet<Record<string, unknown>>(key);
    if (cached) {
      logger.debug('Cache hit', { key });
    }
    return cached;
  }

  async setUserCache(userId: string, data: Record<string, unknown>) {
    const key = `${PREFIXES.user}${userId}`;
    await cacheSet(key, data, USER_TTL);
    logger.debug('Cache set', { key, ttl: USER_TTL });
  }

  async invalidateUserCache(userId: string) {
    const key = `${PREFIXES.user}${userId}`;
    await cacheDelete(key);
    logger.debug('Cache invalidated', { key });
  }

  async getProjectCache(projectId: string) {
    const key = `${PREFIXES.project}${projectId}`;
    return cacheGet<Record<string, unknown>>(key);
  }

  async setProjectCache(projectId: string, data: Record<string, unknown>) {
    const key = `${PREFIXES.project}${projectId}`;
    await cacheSet(key, data, PROJECT_TTL);
  }

  async invalidateProjectCache(projectId: string) {
    const key = `${PREFIXES.project}${projectId}`;
    await cacheDelete(key);
  }

  async getOrgCache(orgId: string) {
    const key = `${PREFIXES.org}${orgId}`;
    return cacheGet<Record<string, unknown>>(key);
  }

  async setOrgCache(orgId: string, data: Record<string, unknown>) {
    const key = `${PREFIXES.org}${orgId}`;
    await cacheSet(key, data, DEFAULT_TTL);
  }
}

export const cacheService = new CacheService();
