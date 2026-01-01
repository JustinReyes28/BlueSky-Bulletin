import { Redis } from '@upstash/redis';

let redis: Redis | null = null;

function getRedis() {
    if (!redis) {
        const kvRestApiUrl = process.env.KV_REST_API_URL;
        const kvRestApiToken = process.env.KV_REST_API_TOKEN;

        if (!kvRestApiUrl || !kvRestApiToken) {
            console.warn('Missing KV_REST_API_URL or KV_REST_API_TOKEN. Caching disabled.');
            return null;
        }

        redis = new Redis({
            url: kvRestApiUrl,
            token: kvRestApiToken,
        });
    }
    return redis;
}

/**
 * Rounds a coordinate to 1 decimal place for better cache hit rates (~10km precision)
 * Hey there! This helps us find cached weather data faster for nearby locations.
 */
export function roundCoordinate(coord: number): string {
    return coord.toFixed(1);
}

export async function getCachedData<T>(key: string): Promise<T | null> {
    try {
        const client = getRedis();
        if (!client) return null;

        // Let's see if we already have this info saved
        return await client.get<T>(key);
    } catch (error) {
        console.error('Oops! Couldn\'t check the cache:', error);
        return null;
    }
}

export async function setCachedData<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
        const client = getRedis();
        if (!client) return;

        // Let's save this info for later
        await client.set(key, value, { ex: ttlSeconds });
    } catch (error) {
        console.error('Hmm, couldn\'t save to cache:', error);
    }
}

export function generateWeatherKey(lat: number, lon: number): string {
    // Creating a friendly key for weather data
    return `weather:${roundCoordinate(lat)},${roundCoordinate(lon)}`;
}

export function generateInsightKey(lat: number, lon: number): string {
    // Creating a friendly key for weather insights
    return `insights:${roundCoordinate(lat)},${roundCoordinate(lon)}`;
}

export function generateAIInsightKey(lat: number, lon: number, date: string): string {
    // Creating a friendly key for AI-generated insights
    return `ai-insights:${roundCoordinate(lat)},${roundCoordinate(lon)}:${date}`;
}
