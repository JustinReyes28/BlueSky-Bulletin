import { WeatherData } from './types';

const BASE_URL = 'https://api.open-meteo.com/v1/forecast';

export async function fetchWeather(lat: number, lon: number): Promise<WeatherData> {
    const params = new URLSearchParams({
        latitude: lat.toString(),
        longitude: lon.toString(),
        current: 'temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,weather_code,wind_speed_10m,uv_index',
        hourly: 'temperature_2m,weather_code,uv_index',
        daily: 'weather_code,temperature_2m_max,temperature_2m_min,uv_index_max,precipitation_sum',
        timezone: 'auto',
        past_days: '1',
        forecast_days: '7',
    });

    const response = await fetch(`${BASE_URL}?${params.toString()}`);

    if (!response.ok) {
        throw new Error('Failed to fetch weather data');
    }

    const data = await response.json();

    return {
        latitude: data.latitude,
        longitude: data.longitude,
        current: {
            time: data.current.time,
            temperature2m: data.current.temperature_2m,
            relativeHumidity2m: data.current.relative_humidity_2m,
            apparentTemperature: data.current.apparent_temperature,
            isDay: data.current.is_day,
            precipitation: data.current.precipitation,
            weatherCode: data.current.weather_code,
            windSpeed10m: data.current.wind_speed_10m,
            uvIndex: data.current.uv_index,
        },
        hourly: {
            time: data.hourly.time,
            temperature2m: data.hourly.temperature_2m,
            weatherCode: data.hourly.weather_code,
            uvIndex: data.hourly.uv_index,
        },
        daily: {
            time: data.daily.time,
            weatherCode: data.daily.weather_code,
            temperature2mMax: data.daily.temperature_2m_max,
            temperature2mMin: data.daily.temperature_2m_min,
            uvIndexMax: data.daily.uv_index_max,
            precipitationSum: data.daily.precipitation_sum,
        },
    };
}
