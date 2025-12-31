"use client";

import { Thermometer, Droplets, Wind, Gauge } from "lucide-react";
import { WeatherData } from "@/lib/weather/types";
import { getWeatherIcon, formatTemp } from "@/lib/weather/ui-utils";

interface CurrentWeatherProps {
    data?: WeatherData | null;
    loading?: boolean;
}

export default function CurrentWeather({ data, loading }: CurrentWeatherProps) {
    if (loading) {
        return <div className="p-6 border rounded-lg bg-card animate-pulse h-[200px]" />;
    }

    if (!data) return null;

    const { current } = data;

    return (
        <div className="p-8 border rounded-lg bg-card text-card-foreground shadow-sm">
            <div className="flex justify-between items-start">
                <div>
                    <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-4">Current Condition</h2>
                    <div className="flex items-center gap-6">
                        <span className="text-7xl font-bold tracking-tighter">{formatTemp(current.temperature2m)}</span>
                        {getWeatherIcon(current.weatherCode)}
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 gap-4 mt-8 pt-8 border-t">
                <div className="flex items-center gap-3">
                    <Droplets className="w-4 h-4 text-blue-400" />
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-semibold text-muted">Humidity</span>
                        <span className="text-sm font-medium">{current.relativeHumidity2m}%</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Wind className="w-4 h-4 text-slate-400" />
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-semibold text-muted">Wind</span>
                        <span className="text-sm font-medium">{current.windSpeed10m} km/h</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Thermometer className="w-4 h-4 text-orange-400" />
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-semibold text-muted">Feels Like</span>
                        <span className="text-sm font-medium">{formatTemp(current.apparentTemperature)}</span>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <Gauge className="w-4 h-4 text-purple-400" />
                    <div className="flex flex-col">
                        <span className="text-[10px] uppercase font-semibold text-muted">UV Index</span>
                        <span className="text-sm font-medium">{current.uvIndex}</span>
                    </div>
                </div>
            </div>
        </div>
    );
}
