# Caching Architecture

## Overview
BlueSky Bulletin uses an in-memory **LRU (Least Recently Used)** cache powered by `lru-cache` (`lib/cache/memory-cache.ts`). It requires zero external infrastructure or environment variables while keeping the same async interface (`getCachedData`, `setCachedData`, and key generators) so a distributed cache like Redis can be dropped back in later with minimal changes.

## Cache Configuration
- **Implementation:** `lib/cache/memory-cache.ts` (`lru-cache`)
- **Max Entries:** `500` items (evicts least-recently-used entries automatically to bound memory usage)
- **Default TTL:** `30` minutes (`1,800,000` ms)
- **Coordinate Rounding:** Coordinates are rounded to `1` decimal place (~10 km precision) to maximize cache hits for nearby requests.

## Cached Endpoints

| Endpoint | Cache Key Format | TTL |
|---|---|---|
| `GET /api/weather` | `weather:{lat.toFixed(1)},{lon.toFixed(1)}` | 30 minutes (`1800` seconds) |
| `POST /api/insights` | `insights:{lat.toFixed(1)},{lon.toFixed(1)}` | 8 hours (`28800` seconds) |

## Limitations & Upgrading to Redis Later
- Because the cache lives in Node.js process memory, entries are per-instance and reset on cold starts or redeployments (e.g., serverless functions on Vercel).
- `getCachedData` and `setCachedData` are already `async` functions, so switching back to Redis later only requires replacing the implementation inside `lib/cache/memory-cache.ts` (or swapping the import path) without changing route handler logic.
