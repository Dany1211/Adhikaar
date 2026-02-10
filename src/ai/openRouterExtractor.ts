/**
 * openRouterExtractor.ts
 *
 * AI is used ONLY as a parser. Never controls logic.
 */

import { EligibilityState } from './eligibilityState';
import { OPENROUTER_API_KEY } from '@env';

if (!OPENROUTER_API_KEY) {
    throw new Error('OPENROUTER_API_KEY missing in .env');
}

const API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const MODEL = 'google/gemini-2.0-flash-001';

export const extractEligibilityInfo = async (
    userMessage: string,
    currentState: EligibilityState,
    lastBotQuestion?: string | null
): Promise<Partial<EligibilityState>> => {
    const systemPrompt = `
You are a strict JSON extractor.

CURRENT STATE:
${JSON.stringify(currentState)}

LAST QUESTION ASKED:
"${lastBotQuestion || 'None'}"

RULES:
- Extract ONLY explicitly stated info
- If user answers "Yes" or "No" to the LAST QUESTION, infer the relevant field (e.g., "Are you a farmer?" + "Yes" -> isFarmer: true)
- Never guess
- Never erase fields
- Output ONLY valid JSON

FIELDS:
age: number
gender: "male" | "female" | "other"
state: string
occupation: string
incomeRange: "<1L" | "1-3L" | "3-5L" | ">5L"
isFarmer: boolean
`;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                temperature: 0,
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userMessage },
                ],
            }),
        });

        const data = await res.json();
        const text = data?.choices?.[0]?.message?.content;

        if (!text) return {};

        return JSON.parse(text.replace(/```json|```/g, '').trim());
    } catch {
        return {};
    }
};

export const generateExplanation = async (
    schemes: any[],
    state: EligibilityState
): Promise<string> => {
    const prompt = `
User profile: ${JSON.stringify(state)}
Schemes: ${schemes.map((s) => s.name).join(', ')}

Explain eligibility briefly (max 3 sentences).
`;

    try {
        const res = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${OPENROUTER_API_KEY}`,
            },
            body: JSON.stringify({
                model: MODEL,
                messages: [{ role: 'user', content: prompt }],
            }),
        });

        const data = await res.json();
        return data?.choices?.[0]?.message?.content ?? 'You are eligible for some schemes.';
    } catch {
        return 'You are eligible for some schemes.';
    }
};
