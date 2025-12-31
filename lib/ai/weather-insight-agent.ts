import { SYSTEM_PROMPT, generateAnalystPrompt } from './prompt-templates';

const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
const MODEL = 'meta-llama/llama-3-8b-instruct:free'; // Using a free model for MVP

export interface WeatherInsight {
    dailyBriefing: string;
    insights: string[];
}

export async function generateWeatherInsights(
    locationName: string,
    weatherData: any
): Promise<WeatherInsight> {
    if (!OPENROUTER_API_KEY) {
        return getFallbackInsights();
    }

    try {
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
                    { role: 'system', content: SYSTEM_PROMPT },
                    { role: 'user', content: generateAnalystPrompt(locationName, weatherData) },
                ],
                response_format: { type: 'json_object' },
            }),
        });

        if (!response.ok) {
            throw new Error('AI service error');
        }

        const data = await response.json();
        const content = JSON.parse(data.choices[0].message.content);

        return {
            dailyBriefing: content.dailyBriefing || 'Weather summary unavailable.',
            insights: content.insights || [],
        };
    } catch (error) {
        console.error('AI Insight Generation Error:', error);
        return getFallbackInsights();
    }
}

function getFallbackInsights(): WeatherInsight {
    return {
        dailyBriefing: "Cloudy with a chance of rain today. Keep an eye on the sky!",
        insights: [
            "Bring an umbrella just in case.",
            "Good day for indoor activities.",
            "Temperatures are consistent with recent patterns."
        ]
    };
}
