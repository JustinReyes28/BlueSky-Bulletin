import { NextRequest, NextResponse } from 'next/server';
import { fetchWeather } from '@/lib/weather/open-meteo';
import { coordinateSchema } from '@/lib/validation';

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const latStr = searchParams.get('lat');
    const lonStr = searchParams.get('lon');

    const validation = coordinateSchema.safeParse({ lat: latStr, lon: lonStr });

    if (!validation.success) {
        return NextResponse.json({ error: 'Invalid coordinates' }, { status: 400 });
    }

    try {
        const data = await fetchWeather(validation.data.lat, validation.data.lon);
        return NextResponse.json(data);
    } catch (error) {
        console.error('Weather Fetch Error:', error);
        return NextResponse.json({ error: 'Failed to fetch weather data' }, { status: 500 });
    }
}
