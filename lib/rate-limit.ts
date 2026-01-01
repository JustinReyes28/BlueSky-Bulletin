import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

// Replace the current Redis initialization with this:
const kvRestApiUrl = process.env.UPSTASH_REDIS_REST_URL;
const kvRestApiToken = process.env.UPSTASH_REDIS_REST_TOKEN;

if (!kvRestApiUrl || !kvRestApiToken) {
    const missingVars = [];
    if (!kvRestApiUrl) missingVars.push('UPSTASH_REDIS_REST_URL');
    if (!kvRestApiToken) missingVars.push('UPSTASH_REDIS_REST_TOKEN');
    throw new Error(`Missing required environment variables: ${missingVars.join(', ')}. Please set UPSTASH_REDIS_REST_URL and UPSTASH_REDIS_REST_TOKEN for rate limiting.`);
}

const redis = new Redis({
    url: kvRestApiUrl,
    token: kvRestApiToken,
});

// Let's set up some friendly limits - 30 requests per minute sounds fair!
export const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
    prefix: '@upstash/ratelimit',
});

export async function checkRateLimit(ip: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    // Let's see if this user is playing nice with our rate limits
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);
    return { success, limit, remaining, reset };
}
