import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
});

/**
 * Rounds a coordinate to 2 decimal places for better cache hit rates (~1km precision)
 */
export function roundCoordinate(coord: number): string {
    return coord.toFixed(2);
}

export async function getCachedData<T>(key: string): Promise<T | null> {
    try {
        return await redis.get<T>(key);
    } catch (error) {
        console.error('Redis Get Error:', error);
        return null;
    }
}

export async function setCachedData<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
        await redis.set(key, value, { ex: ttlSeconds });
    } catch (error) {
        console.error('Redis Set Error:', error);
    }
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
