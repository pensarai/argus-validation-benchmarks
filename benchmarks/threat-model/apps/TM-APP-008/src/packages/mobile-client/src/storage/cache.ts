import AsyncStorage from '@react-native-async-storage/async-storage';

const CACHE_PREFIX = 'cache:';
const MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10MB

interface CacheEntry<T> { data: T; timestamp: number; ttlMs: number; }

export async function getCached<T>(key: string): Promise<T | null> {
  const raw = await AsyncStorage.getItem(`${CACHE_PREFIX}${key}`);
  if (!raw) return null;
  try {
    const entry: CacheEntry<T> = JSON.parse(raw);
    const isExpired = Date.now() - entry.timestamp > entry.ttlMs;
    if (isExpired) { await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`); return null; }
    return entry.data;
  } catch { return null; }
}

export async function setCache<T>(key: string, data: T, ttlMs: number = 5 * 60 * 1000): Promise<void> {
  const entry: CacheEntry<T> = { data, timestamp: Date.now(), ttlMs };
  await AsyncStorage.setItem(`${CACHE_PREFIX}${key}`, JSON.stringify(entry));
}

export async function invalidateCache(key: string): Promise<void> {
  await AsyncStorage.removeItem(`${CACHE_PREFIX}${key}`);
}

export async function clearAllCache(): Promise<void> {
  const keys = await AsyncStorage.getAllKeys();
  const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
  if (cacheKeys.length > 0) await AsyncStorage.multiRemove(cacheKeys);
}

export async function getCacheSize(): Promise<number> {
  const keys = await AsyncStorage.getAllKeys();
  const cacheKeys = keys.filter((k) => k.startsWith(CACHE_PREFIX));
  let totalSize = 0;
  for (const key of cacheKeys) {
    const val = await AsyncStorage.getItem(key);
    if (val) totalSize += val.length;
  }
  return totalSize;
}
