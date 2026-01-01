import { NextRequest, NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/weather/open-meteo';
import { coordinateSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { getCachedData, setCachedData, generateWeatherKey } from '@/lib/cache/upstash-cache';

export async function GET(req: NextRequest) {
    const ip = req.ip || 'anonymous';
    const ratelimit = await checkRateLimit(ip);

    if (!ratelimit.success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');

    const validation = coordinateSchema.safeParse({ lat: latStr, lon: lonStr });

    if (!validation.success) {
        return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    const { lat, lon } = validation.data;
    const cacheKey = generateWeatherKey(lat, lon);

    try {
        // Try to get from cache
        const cached = await getCachedData(cacheKey);
        if (cached) {
            return NextResponse.json(cached);
        }

        const data = await fetchWeather(lat, lon);

        // Cache for 30 minutes (1800 seconds)
        await setCachedData(cacheKey, data, 1800);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Weather Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }
}
