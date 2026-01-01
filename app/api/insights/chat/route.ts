import { NextRequest, NextResponse } from 'next/server';
import { CHAT_SYSTEM_PROMPT } from '@/lib/ai/prompt-templates';
import { checkRateLimit } from '@/lib/rate-limit';

// const MODEL = 'xiaomi/mimo-v2-flash:free';
const MODEL = 'ministral-3b-2512';

export async function POST(req: NextRequest) {
    const { messages, weatherContext, locationName } = await req.json();

    if (!messages || !Array.isArray(messages)) {
        return NextResponse.json({ error: 'Hey, we need some messages to chat about!' }, { status: 400 });
    }

    const ip = req.ip || 'anonymous';
    const ratelimit = await checkRateLimit(ip);

    if (!ratelimit.success) {
        return NextResponse.json({ error: 'Whoa there! Too many requests. Take a breather and try again in a bit.' }, { status: 429 });
    }

    if (!process.env.MISTRAL_API_KEY) {
        console.error('MISTRAL_API_KEY is not set');
        return NextResponse.json(
            { error: 'Our weather chatbot is taking a quick nap. Try again soon!' },
            { status: 503 }
        );
    }

    try {
        // Let's make the weather data smaller so our chatbot can focus
        const optimizedWeatherContext = weatherContext ? {
            ...weatherContext,
            hourly: {
                time: weatherContext.hourly.time.slice(0, 24),
                temperature2m: weatherContext.hourly.temperature2m.slice(0, 24),
                weatherCode: weatherContext.hourly.weatherCode.slice(0, 24),
                uvIndex: weatherContext.hourly.uvIndex.slice(0, 24),
            }
        } : null;

        // Time to chat with our weather expert!
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [
                    { role: 'system', content: CHAT_SYSTEM_PROMPT + `\n\nContext for current chat:\nLocation: ${locationName}\nWeather Data: ${JSON.stringify(optimizedWeatherContext)}` } as any,
                    ...messages,
                ],
                max_tokens: 1000,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            console.error('AI service error:', data);
            throw new Error(data.error || 'Our weather chatbot is having a bad day');
        }

        let content = data.choices?.[0]?.message?.content;

        if (!content) {
            console.error('Empty response from AI service');
            throw new Error('Our chatbot didn\'t say anything! How rude.');
        }

        // Let's clean up any weird formatting
        if (typeof content === 'string') {
            content = content.replace(/\*\*|__/g, '');
        }

        return NextResponse.json({
            content: content
        });
    } catch (error: any) {
        console.error('AI Chat Error:', error);
        return NextResponse.json({
            error: 'Oops! Our chatbot stumbled. Maybe try asking something else?',
            details: error.message
        }, { status: 500 });
    }
}
