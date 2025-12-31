"use client";

import { WeatherData } from "@/lib/weather/types";
import { getWeatherIcon, formatTemp } from "@/lib/weather/ui-utils";

interface DailyForecastProps {
    data?: WeatherData | null;
    loading?: boolean;
}

export default function DailyForecast({ data, loading }: DailyForecastProps) {
    if (loading) {
        return <div className="p-6 border rounded-lg animate-pulse h-[300px]" />;
    }

    if (!data) return null;

    const { daily } = data;

    return (
        <div className="p-6 border rounded-lg bg-card text-card-foreground">
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-6">7-Day Forecast</h2>
            <div className="space-y-6">
                {daily.time.slice(1).map((time, i) => (
                    <div key={time} className="flex justify-between items-center group cursor-default">
                        <div className="flex flex-col gap-0.5">
                            <span className="text-sm font-semibold">
                                {new Date(time).toLocaleDateString("en-US", { weekday: "long" })}
                            </span>
                            <span className="text-[10px] text-muted uppercase">
                                {new Date(time).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </span>
                        </div>
                        <div className="flex items-center gap-6">
                            <div className="opacity-70 scale-75">
                                {getWeatherIcon(daily.weatherCode[i + 1])}
                            </div>
                            <div className="flex gap-3 w-20 justify-end">
                                <span className="text-sm font-bold">{formatTemp(daily.temperature2mMax[i + 1])}</span>
                                <span className="text-sm text-muted">{formatTemp(daily.temperature2mMin[i + 1])}</span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
