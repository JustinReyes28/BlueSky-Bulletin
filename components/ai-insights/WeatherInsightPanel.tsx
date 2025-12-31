"use client";

import { WeatherInsight } from "@/lib/ai/weather-insight-agent";
import { Circle } from "lucide-react";

interface WeatherInsightPanelProps {
    insights?: WeatherInsight | null;
    loading?: boolean;
}

export default function WeatherInsightPanel({ insights, loading }: WeatherInsightPanelProps) {
    if (loading) {
        return <div className="p-6 border rounded-lg bg-blue-50/50 dark:bg-blue-950/10 animate-pulse h-[160px]" />;
    }

    if (!insights) return null;

    return (
        <div className="p-6 border rounded-lg bg-blue-50/50 dark:bg-blue-950/10 border-blue-100 dark:border-blue-900/30">
            <h2 className="text-sm font-bold uppercase tracking-widest text-blue-600 dark:text-blue-400 mb-6 flex items-center gap-2">
                <Circle className="w-1.5 h-1.5 fill-current" />
                Key Insights
            </h2>
            <ul className="space-y-4">
                {insights.insights.map((insight, i) => (
                    <li key={i} className="flex gap-4 group">
                        <span className="text-blue-300 dark:text-blue-800 font-mono text-xs mt-1">0{i + 1}</span>
                        <p className="text-sm leading-relaxed text-muted-foreground group-hover:text-foreground transition-colors">
                            {insight}
                        </p>
                    </li>
                ))}
            </ul>
        </div>
    );
}
