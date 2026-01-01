import { NextRequest, NextResponse } from 'next/server';
import { generateWeatherInsights } from '@/lib/ai/weather-insight-agent';
import { fetchWeather } from '@/lib/weather/open-meteo';
import { getCachedData, setCachedData, generateInsightKey } from '@/lib/cache/upstash-cache';
import { checkRateLimit } from '@/lib/rate-limit';
import { insightRequestSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
    const body = await req.json();
    const validation = insightRequestSchema.safeParse(body);

    if (!validation.success) {
        return NextResponse.json({ error: 'Hmm, that doesn\'t look right. Check your info and try again!' }, { status: 400 });
    }

    const ip = req.ip || 'anonymous';
    const ratelimit = await checkRateLimit(ip);

    if (!ratelimit.success) {
        return NextResponse.json({ error: 'Whoa there! Too many requests. Take a breather and try again in a bit.' }, { status: 429 });
    }

    if (!process.env.MISTRAL_API_KEY) {
        console.error('MISTRAL_API_KEY is not set');
        return NextResponse.json(
            { error: 'Oops! Our weather genius is taking a coffee break. Try again soon!' },
            { status: 503 }
        );
    }

    try {
        const { lat, lon, locationName } = validation.data;
        const cacheKey = generateInsightKey(lat, lon);

        // Let's check if we already have insights for this location
        const cached = await getCachedData(cacheKey);
        if (cached) {
            return NextResponse.json(cached);
        }

        // Okay, we need fresh data - let's get the weather first
        const weatherData = await fetchWeather(lat, lon);
        const insights = await generateWeatherInsights(locationName, weatherData);

        // Let's save this for next time (for 2 hours)
        await setCachedData(cacheKey, insights, 7200);

        return NextResponse.json(insights);
    } catch (error) {
        console.error('Insight API Error:', error);
        return NextResponse.json({ error: 'Uh oh! We couldn\'t get your weather insights. Maybe try again?' }, { status: 500 });
    }
}
