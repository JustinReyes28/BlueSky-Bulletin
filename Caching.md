# Upstash Caching Integration Plan

## Overview
This document outlines the plan to integrate Upstash Redis caching into the BlueSky Bulletin application to improve performance and reduce API calls. Upstash offers a free tier that is compatible with Vercel's serverless architecture.

## Current State
The application currently uses:
- In-memory caching for weather insights (`lib/cache/insight-cache.ts`)
- No persistent caching layer
- Rate limiting implemented in API routes

## Proposed Changes

### 1. Setup Upstash Redis
- Create a free Upstash Redis database
- Add environment variables to Vercel:
  ```
  UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN
  ```

### 2. Cache Implementation Strategy

#### Weather Data Caching
- Cache weather API responses from Open-Meteo
- Cache key format: `weather:{round(lat, 2)},{round(lon, 2)}`
- TTL: 30 minutes (weather data doesn't change frequently)
- Coordinates rounded to 2 decimal places (~1km precision) for better cache hit rates

#### Weather Insights Caching
- Replace current in-memory cache with Upstash
- Cache key format: `insights:{round(lat, 2)},{round(lon, 2)}`
- TTL: 2 hours (insights are less time-sensitive)
- Coordinates rounded to 2 decimal places for better cache hit rates

#### AI Daily Briefing and Key Insights Caching
- Cache the AI-generated daily briefing and key insights
- Cache key format: `ai-insights:{round(lat, 2)},{round(lon, 2)}:{date}`
- TTL: 24 hours (weather patterns typically repeat daily)
- This prevents regenerating insights for the same location on the same day
- Significantly reduces Mistral API calls and costs
- Coordinates rounded to 2 decimal places for better cache hit rates

#### Rate Limiting
- Move rate limiting data to Upstash Redis
- Use @upstash/ratelimit library for production-ready rate limiting
- Cache key format: `ratelimit:{ip}`
- TTL: 1 hour (matches current rate limit window)

### 3. Implementation Steps

1. Install required packages:
   ```bash
   npm install @upstash/redis @upstash/ratelimit
   ```

2. Create caching utility:
   - New file: `lib/cache/upstash-cache.ts`
   - Wrapper functions for get/set operations
   - Automatic JSON serialization/deserialization
   - Error handling and fallback to in-memory cache
   - Coordinate rounding helper function

3. Update API routes:
   - `app/api/weather/route.ts` - Add caching layer with coordinate rounding
   - `app/api/insights/route.ts` - Replace in-memory cache with Upstash
   - `app/api/insights/chat/route.ts` - Add caching layer

4. Update rate limiting:
   - Replace in-memory rate limit map with @upstash/ratelimit
   - Implement sliding window algorithm
   - Update rate limiting in all API routes

5. Implement date-based caching for AI insights:
   - Extract date from weather data (UTC)
   - Use date in cache key
   - Only generate new insights if no cached version exists for current date

### 4. Fallback Strategy
- Implement graceful degradation
- If Upstash is unavailable, fall back to:
  - In-memory cache for short-term
  - Direct API calls as last resort
- Log cache failures for monitoring

### 5. Monitoring
- Add logging for cache hits/misses
- Monitor Upstash usage metrics
- Set up alerts for cache failures
- Track API cost savings from caching
- Monitor cache hit rates by location

## Benefits
- Reduced API calls to Open-Meteo and Mistral
- Faster response times for users
- Lower costs (fewer API calls)
- Better scalability
- Consistent insights for same location/day
- Improved cache hit rates through coordinate rounding

## Risks and Mitigations
- **Cache stampede**: Implement lock mechanism
- **Cold starts**: Pre-warm cache for common locations
- **Cost overruns**: Set Upstash budget alerts
- **Data staleness**: Appropriate TTL values
- **Date boundary issues**: Use UTC dates for consistency
- **Coordinate rounding**: 2 decimal places provides ~1km precision which is appropriate for weather data

## Migration Plan
1. Implement caching in development
2. Test with mock Upstash client
3. Deploy to staging with real Upstash
4. Monitor performance and cost savings
5. Gradual rollout to production
6. Monitor cache hit rates and adjust coordinate rounding precision if needed
