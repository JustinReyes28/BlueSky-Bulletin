import { LRUCache } from 'lru-cache';

interface CacheEntry {
    value: unknown;
}

const MAX_CACHE_ENTRIES = 500;
const DEFAULT_TTL_MS = 30 * 60 * 1000; // 30 minutes

const globalForCache = globalThis as typeof globalThis & {
    __blueSkyCache?: LRUCache<string, CacheEntry>;
};

const cache =
    globalForCache.__blueSkyCache ??
    new LRUCache<string, CacheEntry>({
        max: MAX_CACHE_ENTRIES,
        ttl: DEFAULT_TTL_MS,
    });

if (process.env.NODE_ENV !== 'production') {
    globalForCache.__blueSkyCache = cache;
}

/**
 * Rounds a coordinate to 1 decimal place for better cache hit rates (~10km precision)
 */
export function roundCoordinate(coord: number): string {
    return coord.toFixed(1);
}

export async function getCachedData<T>(key: string): Promise<T | null> {
    const entry = cache.get(key);
    return entry ? (entry.value as T) : null;
}

export async function setCachedData<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    if (ttlSeconds <= 0) return;
    cache.set(key, { value }, { ttl: ttlSeconds * 1000 });
}

export function clearCache(): void {
    cache.clear();
}

export function generateWeatherKey(lat: number, lon: number): string {
    return `weather:${roundCoordinate(lat)},${roundCoordinate(lon)}`;
}

export function generateInsightKey(lat: number, lon: number): string {
    return `insights:${roundCoordinate(lat)},${roundCoordinate(lon)}`;
}

export function generateAIInsightKey(lat: number, lon: number, date: string): string {
    return `ai-insights:${roundCoordinate(lat)},${roundCoordinate(lon)}:${date}`;
}
