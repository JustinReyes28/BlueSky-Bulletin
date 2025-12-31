import { SYSTEM_PROMPT, generateAnalystPrompt } from './prompt-templates';

// const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY;
// const MODEL = 'xiaomi/mimo-v2-flash:free'; // Using a free model for MVP
const MISTRAL_API_KEY = process.env.MISTRAL_API_KEY;
const MODEL = 'ministral-3b-2512';

export interface WeatherInsight {
    dailyBriefing: string;
    insights: string[];
}

export async function generateWeatherInsights(
    locationName: string,
    weatherData: any
): Promise<WeatherInsight> {
    if (!MISTRAL_API_KEY) {
        return getFallbackInsights();
    }

    try {
        console.log('Generating insights for:', locationName);
        console.log('Weather data:', JSON.stringify(weatherData, null, 2));
        const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${MISTRAL_API_KEY}`,
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
        console.log('AI API response:', JSON.stringify(data, null, 2));
        const content = JSON.parse(data.choices[0].message.content);
        console.log('Parsed AI content:', JSON.stringify(content, null, 2));

        // Ensure insights are always plain strings, extracting text from objects if necessary
        const processedInsights = Array.isArray(content.insights)
            ? content.insights.map((insight: any) => {
                let processedText = '';

                if (typeof insight === 'string') {
                    processedText = insight;
                } else if (typeof insight === 'object' && insight !== null) {
                    // Extract text from the object recursively, avoiding JSON.stringify
                    console.log('Object insight detected:', JSON.stringify(insight, null, 2));
                    processedText = extractTextFromObject(insight);
                } else {
                    processedText = String(insight);
                }

                // Clean up markdown formatting and special characters
                return cleanText(processedText);
            })
            : [];
        console.log('Processed insights:', processedInsights);

        return {
            dailyBriefing: cleanText(content.dailyBriefing || 'Weather summary unavailable.'),
            insights: processedInsights,
        };
    } catch (error) {
        console.error('AI Insight Generation Error:', error);
        return getFallbackInsights();
    }
}

// Helper function to recursively extract text from objects
function extractTextFromObject(obj: any): string {
    if (typeof obj === 'string') return obj;
    if (typeof obj === 'number' || typeof obj === 'boolean') return String(obj);
    if (Array.isArray(obj)) return obj.map(item => extractTextFromObject(item)).join(' ');
    if (obj && typeof obj === 'object') {
        return Object.values(obj).map(value => extractTextFromObject(value)).join(' ');
    }
    return '';
}

// Helper function to clean text and remove markdown formatting
function cleanText(text: string): string {
    // Remove markdown formatting
    return text
        .replace(/\*\*(.*?)\*\*/g, '$1') // Remove **bold**
        .replace(/__(.*?)__/g, '$1')     // Remove __italic__
        .replace(/\*(.*?)\*/g, '$1')     // Remove *italic*
        .replace(/_(.*?)_/g, '$1')       // Remove _italic_
        .replace(/`(.*?)`/g, '$1')       // Remove `code`
        .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Remove [text](url) links
        .replace(/[#>*`~]/g, '')         // Remove other markdown symbols
        .replace(/\s+/g, ' ')            // Normalize whitespace
        .trim();
}

function getFallbackInsights(): WeatherInsight {
    console.log('Fallback insights triggered');
    const fallbackTexts = [
        "Bring an umbrella just in case.",
        "Good day for indoor activities.",
        "Temperatures are consistent with recent patterns."
    ];

    return {
        dailyBriefing: cleanText("Cloudy with a chance of rain today. Keep an eye on the sky!"),
        insights: fallbackTexts.map(text => cleanText(text))
    };
}
