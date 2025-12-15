import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

// Delay helper for rate limiting
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

export async function generateWithGemini<T>(
    systemPrompt: string,
    userMessage: string,
    retries: number = 3
): Promise<T> {
    // Try gemini-2.0-flash-exp first (available in user's list)
    let modelName = 'gemini-2.0-flash-exp';

    const prompt = `${systemPrompt}\n\n---\n\nUser Request:\n${userMessage}`;

    for (let attempt = 0; attempt < retries; attempt++) {
        try {
            // Add delay between requests to avoid rate limiting
            if (attempt > 0) {
                console.log(`Retry attempt ${attempt + 1}/${retries}, waiting...`);
                await delay(5000 * attempt); // Exponential backoff
            }

            // On last retry, try gemini-flash-latest as fallback
            if (attempt === retries - 1) {
                modelName = 'gemini-flash-latest';
            }

            console.log(`--> Using Gemini Model: ${modelName} (Attempt ${attempt + 1}/${retries})`);

            const model = genAI.getGenerativeModel({
                model: modelName,
                generationConfig: {
                    temperature: 0.7,
                    maxOutputTokens: 4096,
                },
            });

            const result = await model.generateContent(prompt);
            const response = await result.response;
            const text = response.text();

            // Parse JSON from response (handle markdown code blocks)
            return parseJsonResponse<T>(text);
        } catch (error: unknown) {
            const err = error as { status?: number; message?: string };
            console.error(`Attempt ${attempt + 1} (${modelName}) failed:`, err.message || error);

            // If rate limited, wait longer
            if (err.status === 429 || (err.message && err.message.includes('429'))) {
                console.log('Rate limited, waiting 30 seconds...');
                await delay(30000);
            } else if (attempt === retries - 1) {
                throw error;
            }
        }
    }

    throw new Error('Max retries exceeded');
}

export function parseJsonResponse<T>(text: string): T {
    // Remove markdown code blocks if present
    let jsonString = text.trim();

    // Handle ```json ... ``` format
    const jsonBlockMatch = jsonString.match(/```(?:json)?\s*([\s\S]*?)```/);
    if (jsonBlockMatch) {
        jsonString = jsonBlockMatch[1].trim();
    }

    // Try to find JSON object or array
    const jsonMatch = jsonString.match(/(\{[\s\S]*\}|\[[\s\S]*\])/);
    if (jsonMatch) {
        jsonString = jsonMatch[1];
    }

    try {
        return JSON.parse(jsonString) as T;
    } catch (error) {
        console.error('Failed to parse JSON:', text);
        throw new Error(`Failed to parse AI response as JSON: ${error}`);
    }
}

export async function generateTextWithGemini(
    systemPrompt: string,
    userMessage: string
): Promise<string> {
    const model = genAI.getGenerativeModel({
        model: 'gemini-2.0-flash-exp',
        generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096,
        },
    });

    const prompt = `${systemPrompt}\n\n---\n\nUser Request:\n${userMessage}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    return response.text();
}
