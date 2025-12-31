"use client";

import { useState, useEffect } from "react";
import { useGeolocation } from "@/hooks/useGeolocation";
import { useWeather } from "@/hooks/useWeather";
import { useWeatherInsights } from "@/hooks/useWeatherInsights";
import CurrentWeather from "@/components/weather/CurrentWeather";
import HourlyForecast from "@/components/weather/HourlyForecast";
import DailyForecast from "@/components/weather/DailyForecast";
import WeatherInsightPanel from "@/components/ai-insights/WeatherInsightPanel";
import DailyBriefingCard from "@/components/ai-insights/DailyBriefingCard";
import InsightChat from "@/components/ai-insights/InsightChat";
import dynamic from "next/dynamic";
import LocationSearch from "@/components/search/LocationSearch";
import { Location } from "@/lib/weather/types";
import { Cloud, MapPin, RefreshCw } from "lucide-react";

const WeatherMap = dynamic(() => import("@/components/map/WeatherMap"), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-muted animate-pulse" />,
}) as any; // Cast as any to resolve IntrinsicAttributes error in dynamic import for now, or use React.ComponentType

export default function Home() {
  const { coords, loading: geoLoading } = useGeolocation();
  const [selectedLocation, setSelectedLocation] = useState<Location | null>(null);

  // Default to geolocation if available, otherwise NY
  const lat = selectedLocation?.latitude ?? coords?.latitude ?? 40.7128;
  const lon = selectedLocation?.longitude ?? coords?.longitude ?? -74.0060;
  const locationName = selectedLocation?.name ?? (coords ? "Current Location" : "New York");

  const { data: weatherData, loading: weatherLoading } = useWeather(lat, lon);
  const { insights, loading: insightLoading } = useWeatherInsights(lat, lon, locationName);

  return (
    <div className="min-h-screen bg-background transition-colors duration-500">
      <div className="max-w-7xl mx-auto p-4 md:p-8 space-y-12">
        {/* Header Section */}
        <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b pb-8">
          <div className="space-y-1">
            <div className="flex items-center gap-3">
              <Cloud className="w-8 h-8 text-accent" />
              <h1 className="text-4xl font-bold tracking-tighter">BlueSky Bulletin</h1>
            </div>
            <div className="flex items-center gap-2 text-muted text-sm font-medium">
              <MapPin className="w-3 h-3" />
              <span>{locationName}</span>
              {(weatherLoading || insightLoading) && <RefreshCw className="w-3 h-3 animate-spin ml-2" />}
            </div>
          </div>
          <div className="w-full md:w-auto">
            <LocationSearch onLocationSelect={(loc: Location) => setSelectedLocation(loc)} />
          </div>
        </header>

        {/* Main Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
          {/* Left Column: AI & Map (8 columns) */}
          <div className="lg:col-span-8 space-y-12">
            <DailyBriefingCard insights={insights} loading={insightLoading} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 h-auto">
              <div className="h-[400px] rounded-xl overflow-hidden border shadow-inner group">
                <WeatherMap lat={lat} lon={lon} locationName={locationName} />
              </div>
              <CurrentWeather data={weatherData} loading={weatherLoading} />
            </div>

            <HourlyForecast data={weatherData} loading={weatherLoading} />
            <InsightChat weatherContext={weatherData} locationName={locationName} />
          </div>

          {/* Right Column: Forecast & Insights (4 columns) */}
          <div className="lg:col-span-4 space-y-12">
            <WeatherInsightPanel insights={insights} loading={insightLoading} />
            <DailyForecast data={weatherData} loading={weatherLoading} />
          </div>
        </div>

        {/* Footer */}
        <footer className="pt-12 border-t text-center text-[10px] uppercase tracking-[0.3em] font-bold text-muted/30 pb-8">
          BlueSky Bulletin / Built with AI Weather Agent.
        </footer>
      </div>
    </div>
  );
}
