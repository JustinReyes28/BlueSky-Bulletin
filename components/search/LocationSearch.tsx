"use client";

import { useState, useEffect, useRef } from "react";
import { Search, MapPin, Loader2 } from "lucide-react";
import { Location } from "@/lib/weather/types";

interface LocationSearchProps {
    onLocationSelect: (location: Location) => void;
}

export default function LocationSearch({ onLocationSelect }: LocationSearchProps) {
    const [query, setQuery] = useState("");
    const [results, setResults] = useState<Location[]>([]);
    const [loading, setLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    useEffect(() => {
        if (query.length < 2) {
            setResults([]);
            return;
        }

        const timer = setTimeout(async () => {
            setLoading(true);
            try {
                const response = await fetch(
                    `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
                        query
                    )}&count=5&language=en&format=json`
                );
                const data = await response.json();
                setResults(data.results || []);
                setIsOpen(true);
            } catch (error) {
                console.error("Geocoding error:", error);
            } finally {
                setLoading(false);
            }
        }, 300);

        return () => clearTimeout(timer);
    }, [query]);

    return (
        <div ref={containerRef} className="relative w-full max-w-sm">
            <div className="relative">
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Search for a city..."
                    className="w-full pl-10 pr-4 py-2 bg-card border rounded-full text-sm focus:outline-none focus:ring-1 focus:ring-accent transition-all"
                />
                <div className="absolute left-3 top-1/2 -translate-y-1/2">
                    {loading ? (
                        <Loader2 className="w-4 h-4 text-muted animate-spin" />
                    ) : (
                        <Search className="w-4 h-4 text-muted" />
                    )}
                </div>
            </div>

            {isOpen && results.length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-card border rounded-lg shadow-xl z-50 overflow-hidden">
                    {results.map((loc, i) => (
                        <button
                            key={`${loc.latitude}-${loc.longitude}-${i}`}
                            onClick={() => {
                                onLocationSelect(loc);
                                setQuery("");
                                setIsOpen(false);
                            }}
                            className="w-full px-4 py-3 flex items-start gap-3 hover:bg-muted transition-colors text-left border-b last:border-0"
                        >
                            <MapPin className="w-4 h-4 text-accent mt-0.5" />
                            <div className="flex flex-col">
                                <span className="text-sm font-medium">{loc.name}</span>
                                <span className="text-[10px] text-muted uppercase">
                                    {loc.admin1 ? `${loc.admin1}, ` : ""}{loc.country}
                                </span>
                            </div>
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
