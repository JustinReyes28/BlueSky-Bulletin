import { NextRequest, NextResponse } from 'next/server';
import { SYSTEM_PROMPT } from '@/lib/ai/prompt-templates';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'meta-llama/llama-3-8b-instruct:free';

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

        const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
                'Content-Type': 'application/json',
                'HTTP-Referer': process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: 'system', content: SYSTEM_PROMPT + `\n\nContext for current chat:\nLocation: ${locationName}\nWeather Data: ${JSON.stringify(weatherContext)}` },
                    ...messages,
                ],
            }),
        });

        if (!response.ok) {
            throw new Error('AI service error');
        }

        const data = await response.json();
        return NextResponse.json({
            content: data.choices[0].message.content
        });
    } catch (error) {
        console.error('AI Chat Error:', error);
        return NextResponse.json({ error: 'Failed to process chat' }, { status: 500 });
    }
}
