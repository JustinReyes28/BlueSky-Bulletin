import { NextRequest, NextResponse } from 'next/server';
import { generateWeatherInsights } from '@/lib/ai/weather-insight-agent';
import { fetchWeather } from '@/lib/weather/open-meteo';
import { getCachedData, setCachedData, generateInsightKey } from '@/lib/cache/upstash-cache';
import { checkRateLimit } from '@/lib/rate-limit';
import { insightRequestSchema } from '@/lib/validation';

export async function POST(req: NextRequest) {
    const ip = req.ip || 'anonymous';
    const ratelimit = await checkRateLimit(ip);

    if (!ratelimit.success) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    if (!process.env.MISTRAL_API_KEY) {
        console.error('MISTRAL_API_KEY is not set');
        return NextResponse.json(
            { error: 'AI service unavailable - missing API key' },
            { status: 503 }
        );
    }

    try {
        const body = await req.json();
        const validation = insightRequestSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json({ error: 'Invalid request' }, { status: 400 });
        }

        const { lat, lon, locationName } = validation.data;
        const cacheKey = generateInsightKey(lat, lon);

        // Check cache first
        const cached = await getCachedData(cacheKey);
        if (cached) {
            return NextResponse.json(cached);
        }

        // Fetch weather data first to ensure AI has context
        const weatherData = await fetchWeather(lat, lon);
        const insights = await generateWeatherInsights(locationName, weatherData);

        // Cache for 2 hours (7200 seconds)
        await setCachedData(cacheKey, insights, 7200);

        return NextResponse.json(insights);
    } catch (error) {
        console.error('Insight API Error:', error);
        return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
    }
}
