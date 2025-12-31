import { useState, useEffect } from 'react';
import { WeatherData } from '@/lib/weather/types';

export function useWeather(lat?: number, lon?: number) {
    const [data, setData] = useState<WeatherData | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (lat === undefined || lon === undefined) return;

        async function fetchData() {
            setLoading(true);
            setError(null);
            try {
                const response = await fetch(`/api/weather?lat=${lat}&lon=${lon}`);
                if (!response.ok) throw new Error('Failed to fetch weather');
                const weatherData = await response.json();
                setData(weatherData);
            } catch (err: any) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        }

        fetchData();
    }, [lat, lon]);

    return { data, error, loading };
}
