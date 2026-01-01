import { Redis } from '@upstash/redis';

// Replace the current Redis initialization with this:
const kvRestApiUrl = process.env.KV_REST_API_URL;
const kvRestApiToken = process.env.KV_REST_API_TOKEN;

if (!kvRestApiUrl || !kvRestApiToken) {
    const missingVars = [];
    if (!kvRestApiUrl) missingVars.push('KV_REST_API_URL');
    if (!kvRestApiToken) missingVars.push('KV_REST_API_TOKEN');
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. Please configure Upstash Redis.`);
}

const redis = new Redis({
    url: kvRestApiUrl,
    token: kvRestApiToken,
});

/**
 * Rounds a coordinate to 2 decimal places for better cache hit rates (~1km precision)
 * Hey there! This helps us find cached weather data faster for nearby locations.
 */
export function roundCoordinate(coord: number): string {
    return coord.toFixed(2);
}

export async function getCachedData<T>(key: string): Promise<T | null> {
    try {
        // Let's see if we already have this info saved
        return await redis.get<T>(key);
    } catch (error) {
        console.error('Oops! Couldn\'t check the cache:', error);
        return null;
    }
}

export async function setCachedData<T>(key: string, value: T, ttlSeconds: number): Promise<void> {
    try {
        // Let's save this info for later
        await redis.set(key, value, { ex: ttlSeconds });
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
