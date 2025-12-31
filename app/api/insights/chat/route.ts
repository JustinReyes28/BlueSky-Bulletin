import { NextRequest, NextResponse } from 'next/server';
import { CHAT_SYSTEM_PROMPT } from '@/lib/ai/prompt-templates';
import { OpenRouter } from "@openrouter/sdk";

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'xiaomi/mimo-v2-flash:free';

const openrouter = new OpenRouter({
    apiKey: OPENROUTER_API_KEY || '',
});

// Basic in-memory rate limiting for the MVP
const rateLimitMap = new Map<string, { count: number; lastReset: number }>();
const RATE_LIMIT_WINDOW = 60 * 1000; // 1 minute
const MAX_REQUESTS = 5;

function checkRateLimit(ip: string): boolean {
    const now = Date.now();
    const userData = rateLimitMap.get(ip) || { count: 0, lastReset: now };

    if (now - userData.lastReset > RATE_LIMIT_WINDOW) {
        userData.count = 1;
        userData.lastReset = now;
        rateLimitMap.set(ip, userData);
        return true;
    }

    if (userData.count >= MAX_REQUESTS) {
        return false;
    }

    userData.count++;
    rateLimitMap.set(ip, userData);
    return true;
}

export async function POST(req: NextRequest) {
    const ip = req.ip || 'anonymous';

    if (!checkRateLimit(ip)) {
        return NextResponse.json({ error: 'Too many requests' }, { status: 429 });
    }

    if (!OPENROUTER_API_KEY) {
        return NextResponse.json({ error: 'AI service unavailable' }, { status: 503 });
    }

    try {
        const { messages, weatherContext, locationName } = await req.json();

        if (!messages || !Array.isArray(messages)) {
            return NextResponse.json({ error: 'Invalid messages' }, { status: 400 });
        }

        // Optimize weatherContext to reduce token usage
        // Truncate hourly data to only the next 24 hours (default is 168+ hours)
        const optimizedWeatherContext = weatherContext ? {
            ...weatherContext,
            hourly: {
                time: weatherContext.hourly.time.slice(0, 24),
                temperature2m: weatherContext.hourly.temperature2m.slice(0, 24),
                weatherCode: weatherContext.hourly.weatherCode.slice(0, 24),
                uvIndex: weatherContext.hourly.uvIndex.slice(0, 24),
            }
        } : null;

        const response = await openrouter.chat.send({
            model: MODEL,
            messages: [
                { role: 'system', content: CHAT_SYSTEM_PROMPT + `\n\nContext for current chat:\nLocation: ${locationName}\nWeather Data: ${JSON.stringify(optimizedWeatherContext)}` } as any,
                ...messages,
            ],
            maxTokens: 1000,
        });

        // The SDK's chat.send without stream: true returns the full response
        // Based on typical OpenRouter response structure
        let content = response.choices?.[0]?.message?.content;

        if (!content) {
            console.error('Empty response from OpenRouter');
            throw new Error('No content returned from AI service');
        }

        // Programmatic cleanup: Strip markdown formatting characters that AI might still include
        // Removes ** and __
        if (typeof content === 'string') {
            content = content.replace(/\*\*|__/g, '');
        }

        return NextResponse.json({
            content: content
        });
    } catch (error: any) {
        console.error('AI Chat Error:', error);
        return NextResponse.json({
            error: 'Failed to process chat',
            details: error.message
        }, { status: 500 });
    }
}
