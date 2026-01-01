import { NextRequest, NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/weather/open-meteo';
import { coordinateSchema } from '@/lib/validation';
import { checkRateLimit } from '@/lib/rate-limit';
import { getCachedData, setCachedData, generateWeatherKey } from '@/lib/cache/upstash-cache';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');

    const validation = coordinateSchema.safeParse({ lat: latStr, lon: lonStr });

    if (!validation.success) {
        return NextResponse.json({ error: 'Hmm, those coordinates don\'t look right. Double-check and try again!' }, { status: 400 });
    }

    const ip = req.ip || 'anonymous';
    const ratelimit = await checkRateLimit(ip);

    if (!ratelimit.success) {
        return NextResponse.json({ error: 'Whoa there! Too many requests. Take a breather and try again in a bit.' }, { status: 429 });
    }

    const { lat, lon } = validation.data;
    const cacheKey = generateWeatherKey(lat, lon);

    try {
        // Let's see if we already have this weather data
        const cached = await getCachedData(cacheKey);
        if (cached) {
            return NextResponse.json(cached);
        }

        // Okay, we need to fetch fresh weather data
        const data = await fetchWeather(lat, lon);

        // Let's save this for later (for 30 minutes)
        await setCachedData(cacheKey, data, 1800);

        return NextResponse.json(data);
    } catch (error) {
        console.error('Weather Fetch Error:', error);
        return NextResponse.json({ error: 'Oops! We couldn\'t grab the weather info. Maybe try again?' }, { status: 500 });
    }
}
