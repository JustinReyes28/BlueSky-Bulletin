import { NextRequest, NextResponse } from 'next/server';
import { generateWeatherInsights } from '@/lib/ai/weather-insight-agent';
import { fetchWeather } from '@/lib/weather/open-meteo';
import { getCachedInsight, setCachedInsight } from '@/lib/cache/insight-cache';
import { insightRequestSchema } from '@/lib/validation';

// Basic in-memory rate limiting for the MVP
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - userData.lastReset > RATE_LIMIT_WINDOW) {
        userData.count = 1;
        userData.lastReset = now;
        rateLimitMap.set(ip, userData);
        return true;
    }

    if (userData.count >= MAX_REQUESTS) {
        return false;
    }

    userData.count++;
    rateLimitMap.set(ip, userData);
    return true;
}

export async function POST(req: NextRequest) {
    const ip = req.ip || 'anonymous';

    if (!checkRateLimit(ip)) {
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

        // Check cache first
        const cached = getCachedInsight(lat, lon);
        if (cached) {
            return NextResponse.json(cached);
        }

        // Fetch weather data first to ensure AI has context
        const weatherData = await fetchWeather(lat, lon);
        const insights = await generateWeatherInsights(locationName, weatherData);

        // Cache the result
        setCachedInsight(lat, lon, insights);

        return NextResponse.json(insights);
    } catch (error) {
        console.error('Insight API Error:', error);
        return NextResponse.json({ error: 'Failed to generate insights' }, { status: 500 });
    }
}
