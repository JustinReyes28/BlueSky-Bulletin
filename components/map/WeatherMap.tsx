"use client";

import { useEffect, useState, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

interface WeatherMapProps {
    lat?: number;
    lon?: number;
    locationName?: string;
}

export default function WeatherMap({ lat, lon, locationName }: WeatherMapProps) {
    const mapRef = useRef<L.Map | null>(null);
    const markerRef = useRef<L.Marker | null>(null);
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
        return () => {
            if (mapRef.current) {
                mapRef.current.remove();
                mapRef.current = null;
            }
        };
    }, []);

    useEffect(() => {
        if (!mounted || lat === undefined || lon === undefined) return;

        if (!mapRef.current) {
            mapRef.current = L.map("weather-map", {
                center: [lat, lon],
                zoom: 10,
                zoomControl: false,
            });

            L.tileLayer("https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png", {
                attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
                subdomains: "abcd",
                maxZoom: 20,
            }).addTo(mapRef.current);

            L.control.zoom({ position: "bottomright" }).addTo(mapRef.current);
        } else {
            mapRef.current.setView([lat, lon], 10);
        }

        if (markerRef.current) {
            markerRef.current.setLatLng([lat, lon]);
        } else {
            // Create a custom div icon
            const icon = L.divIcon({
                className: "custom-marker",
                html: `<div class="w-4 h-4 bg-accent rounded-full border-2 border-white shadow-lg animate-pulse"></div>`,
                iconSize: [20, 20],
            });
            markerRef.current = L.marker([lat, lon], { icon }).addTo(mapRef.current);
        }

        if (locationName) {
            markerRef.current.bindPopup(`<span class="text-xs font-bold">${locationName}</span>`).openPopup();
        }
    }, [mounted, lat, lon, locationName]);

    if (!mounted) {
        return <div className="w-full h-full bg-muted animate-pulse" />;
    }

    return <div id="weather-map" className="w-full h-full" />;
}
