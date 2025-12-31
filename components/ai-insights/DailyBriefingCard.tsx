"use client";

import { WeatherInsight } from "@/lib/ai/weather-insight-agent";
import { Sparkles } from "lucide-react";

interface DailyBriefingCardProps {
    insights?: WeatherInsight | null;
    loading?: boolean;
}

export default function DailyBriefingCard({ insights, loading }: DailyBriefingCardProps) {
    if (loading) {
        return <div className="p-8 border rounded-lg bg-slate-900 animate-pulse h-[140px]" />;
    }

    if (!insights) return null;

    return (
        <div className="relative p-8 border rounded-lg bg-slate-900 text-white overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition-opacity">
                <Sparkles className="w-24 h-24 text-white" />
            </div>

            <div className="relative z-10">
                <h2 className="text-[10px] uppercase tracking-[0.2em] font-bold text-slate-400 mb-3 flex items-center gap-2">
                    <Sparkles className="w-3 h-3" />
                    AI Daily Briefing
                </h2>
                <p className="text-xl md:text-2xl font-medium leading-tight max-w-2xl">
                    {insights.dailyBriefing}
                </p>
            </div>
        </div>
    );
}
