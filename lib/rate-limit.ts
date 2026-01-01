import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

const redis = new Redis({
    url: process.env.KV_REST_API_URL!,
    token: process.env.KV_REST_API_TOKEN!,
});

// Create a new ratelimiter, that allows 30 requests per 1 minute
export const ratelimit = new Ratelimit({
    redis: redis,
    limiter: Ratelimit.slidingWindow(30, '1 m'),
    analytics: true,
    prefix: '@upstash/ratelimit',
});

export async function checkRateLimit(ip: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);
    return { success, limit, remaining, reset };
}
