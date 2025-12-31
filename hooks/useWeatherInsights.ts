import { useState, useEffect } from 'react';
import { WeatherInsight } from '@/lib/ai/weather-insight-agent';

export function useWeatherInsights(lat?: number, lon?: number, locationName?: string) {
    const [insights, setInsights] = useState<WeatherInsight | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lat === undefined || lon === undefined || !locationName) return;

        async function fetchInsights() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch('/api/insights', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ lat, lon, locationName }),
                });
                if (!response.ok) throw new Error('Failed to fetch insights');
                const data = await response.json();
                setInsights(data);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchInsights();
    }, [lat, lon, locationName]);

    return { insights, error, loading };
}
