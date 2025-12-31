import { LRUCache } from 'lru-cache';

// Cache insights for 30 minutes
const INSIGHT_CACHE_TTL = 30 * 60 * 1000;
const MAX_CACHE_SIZE = 1000;

const insightCache = new LRUCache<string, any>({
    max: MAX_CACHE_SIZE,
    ttl: INSIGHT_CACHE_TTL,
});

export function getCachedInsight(lat: number, lon: number): any | undefined {
    const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    return insightCache.get(key);
}

export function setCachedInsight(lat: number, lon: number, insight: any): void {
    const key = `${lat.toFixed(2)},${lon.toFixed(2)}`;
    insightCache.set(key, insight);
}

export function clearCache(): void {
    insightCache.clear();
}
