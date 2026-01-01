import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';

let ratelimit: Ratelimit | null = null;

export async function checkRateLimit(ip: string): Promise<{ success: boolean; limit: number; remaining: number; reset: number }> {
    if (!ratelimit) {
        const kvRestApiUrl = process.env.UPSTASH_REDIS_REST_URL;
        const kvRestApiToken = process.env.UPSTASH_REDIS_REST_TOKEN;

        if (!kvRestApiUrl || !kvRestApiToken) {
            console.warn('Missing UPSTASH_REDIS_REST_URL or UPSTASH_REDIS_REST_TOKEN. Rate limiting disabled.');
            // Fail open if not configured (e.g. during build or if misconfigured)
            return { success: true, limit: 0, remaining: 0, reset: 0 };
        }

        const redis = new Redis({
            url: kvRestApiUrl,
            token: kvRestApiToken,
        });

        ratelimit = new Ratelimit({
            redis: redis,
            limiter: Ratelimit.slidingWindow(30, '1 m'),
            analytics: true,
            prefix: '@upstash/ratelimit',
        });
    }

    // Let's see if this user is playing nice with our rate limits
    const { success, limit, remaining, reset } = await ratelimit.limit(ip);
    return { success, limit, remaining, reset };
}
