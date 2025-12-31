"use client";

import { WeatherData } from "@/lib/weather/types";
import { getWeatherIcon, formatTemp } from "@/lib/weather/ui-utils";

interface HourlyForecastProps {
    data?: WeatherData | null;
    loading?: boolean;
}

export default function HourlyForecast({ data, loading }: HourlyForecastProps) {
    if (loading) {
        return <div className="p-6 border rounded-lg animate-pulse h-[140px]" />;
    }

    if (!data) return null;

    const { hourly } = data;
    const currentHour = new Date().getHours();
    // Get next 24 hours starting from current hour
    const hoursToShow = hourly.time.slice(currentHour, currentHour + 24);

    return (
        <div className="p-6 border rounded-lg bg-card text-card-foreground">
            <h2 className="text-sm font-medium uppercase tracking-widest text-muted mb-6">Hourly Forecast</h2>
            <div className="flex gap-8 overflow-x-auto pb-6 scrollbar-hide">
                {hoursToShow.map((time, i) => {
                    const index = currentHour + i;
                    const displayTime = new Date(time).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        hour12: true,
                    });

                    return (
                        <div key={time} className="flex flex-col items-center gap-3 min-w-[60px]">
                            <span className="text-[10px] font-bold text-muted uppercase tracking-tighter">
                                {i === 0 ? "Now" : displayTime}
                            </span>
                            <div className="scale-75">
                                {getWeatherIcon(hourly.weatherCode[index])}
                            </div>
                            <span className="text-sm font-bold">
                                {formatTemp(hourly.temperature2m[index])}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
