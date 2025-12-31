import { Sun, Cloud, CloudRain, CloudLightning, Wind, Thermometer, Droplets, Gauge } from "lucide-react";

export function getWeatherIcon(code: number) {
    // WMO Weather interpretation codes (WW)
    if (code === 0) return <Sun className="w-8 h-8 text-yellow-500" />;
    if (code >= 1 && code <= 3) return <Cloud className="w-8 h-8 text-slate-400" />;
    if (code >= 45 && code <= 48) return <Cloud className="w-8 h-8 text-slate-300 animate-pulse" />;
    if (code >= 51 && code <= 67) return <CloudRain className="w-8 h-8 text-blue-400" />;
    if (code >= 71 && code <= 77) return <CloudRain className="w-8 h-8 text-slate-200" />;
    if (code >= 80 && code <= 82) return <CloudRain className="w-8 h-8 text-blue-500" />;
    if (code >= 95) return <CloudLightning className="w-8 h-8 text-yellow-600" />;
    return <Cloud className="w-8 h-8 text-slate-400" />;
}

export function formatTemp(temp: number) {
    return `${Math.round(temp)}°`;
}
