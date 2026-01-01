# How We Keep BlueSky Super Fast

## The Scoop
This doc explains how we use Upstash Redis to make BlueSky lightning fast and save on API costs. Plus, Upstash plays nice with Vercel's serverless setup and has a sweet free tier!

## Where We're At Now
Right now, BlueSky:
- Uses temporary memory caching for weather insights
- Doesn't have persistent caching
- Has some basic request limiting in the API routes

## Our Game Plan

### 1. Setting Up Upstash
- Grab a free Upstash Redis database
- Add these to your Vercel environment:
  ```
  UPSTASH_REDIS_REST_URL
  UPSTASH_REDIS_REST_TOKEN
  ```

### 2. Our Caching Strategy

#### Weather Data
- We'll save weather info from Open-Meteo
- Cache key looks like: `weather:{round(lat, 2)},{round(lon, 2)}`
- Keeps it fresh for 30 minutes (weather doesn't change that fast!)
- We round coordinates to 2 decimal places (~1km precision) for better cache hits

#### Weather Insights
- Swapping our temporary cache for Upstash
- Cache key: `insights:{round(lat, 2)},{round(lon, 2)}`
- Stays fresh for 2 hours (insights don't need to be super real-time)
- Again, rounding coordinates for better performance

#### AI Daily Briefings & Key Insights
- Caching the AI-generated stuff so we don't keep asking for the same thing
- Cache key: `ai-insights:{round(lat, 2)},{round(lon, 2)}:{date}`
- Good for 24 hours (weather patterns usually repeat daily)
- This means we won't keep generating the same insights for the same place on the same day
- Big savings on Mistral API calls and costs!
- Coordinates rounded to 2 decimal places for better cache performance

#### Request Limiting
- Moving our rate limiting to Upstash Redis
- Using @upstash/ratelimit for proper production-ready limiting
- Cache key: `ratelimit:{ip}`
- Resets every hour (matches our current limit window)

### 3. How We'll Do It

1. Install what we need:
   ```bash
   npm install @upstash/redis @upstash/ratelimit
   ```

2. Create a caching helper:
   - New file: `lib/cache/upstash-cache.ts`
   - Handy functions for getting/setting cache
   - Automatic JSON conversion
   - Error handling with fallback to memory cache
   - Helper for rounding coordinates

3. Update our API routes:
   - `app/api/weather/route.ts` - Add caching with coordinate rounding
   - `app/api/insights/route.ts` - Switch to Upstash
   - `app/api/insights/chat/route.ts` - Add caching

4. Improve rate limiting:
   - Replace our memory-based system with @upstash/ratelimit
   - Implement sliding window algorithm
   - Update all API routes

5. Add date-based caching for AI insights:
   - Get date from weather data (UTC)
   - Use date in cache key
   - Only generate new insights if we don't have today's version cached

### 4. What If Caching Fails?
- We'll handle it gracefully
- If Upstash is down, we'll:
  - Use memory cache short-term
  - Fall back to direct API calls if we have to
- Log any cache issues so we can keep an eye on things

### 5. Keeping Tabs On Things
- Log when we hit or miss the cache
- Watch Upstash usage stats
- Set up alerts if caching fails
- Track how much we're saving on API costs
- Monitor which locations are getting the most cache hits

## Why This Rocks
- Fewer calls to Open-Meteo and Mistral = happier APIs
- Faster responses for users = happier people
- Lower costs = happier wallet
- Scales better = happier future us
- Consistent insights for the same place/day = happier experience
- Better cache performance through smart coordinate rounding

## Watch Out For
- **Cache stampede**: We'll add locks to prevent this
- **Cold starts**: Pre-warm cache for popular locations
- **Cost surprises**: Set Upstash budget alerts
- **Stale data**: Smart TTL values help here
- **Date boundary issues**: Using UTC keeps things consistent
- **Coordinate rounding**: 2 decimal places gives us ~1km precision, which is perfect for weather

## Rollout Plan
1. Build caching in development
2. Test with a mock Upstash client
3. Try it in staging with real Upstash
4. Check performance and savings
5. Slowly roll out to production
6. Keep an eye on cache performance and tweak if needed
