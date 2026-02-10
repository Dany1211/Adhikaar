/**
 * conversationController.ts
 *
 * Deterministic brain of the eligibility assistant.
 */

import { EligibilityState } from './eligibilityState';

export const getNextQuestion = (state: EligibilityState): string | null => {
    if (state.age === null) {
        return 'May I know your age to check age-specific schemes?';
    }

    if (state.gender === null) {
        return 'What is your gender? (Male / Female / Other)';
    }

    if (state.state === null) {
        return 'Which state do you currently reside in?';
    }

    if (state.isFarmer === null) {
        return 'Are you a farmer by profession? (Yes / No)';
    }

    if (state.occupation === null) {
        return 'What is your primary occupation? (e.g., Student, Private Job, Daily Wage Worker)';
    }

    if (state.incomeRange === null) {
        return 'What is your annual family income range? (Below 1L, 1–3L, 3–5L, Above 5L)';
    }

    return null;
};

export const inferFieldFromQuestion = (
    question: string
): keyof EligibilityState | null => {
    const q = question.toLowerCase();

    if (q.includes('age')) return 'age';
    if (q.includes('gender')) return 'gender';
    if (q.includes('state')) return 'state';
    if (q.includes('farmer')) return 'isFarmer';
    if (q.includes('occupation')) return 'occupation';
    if (q.includes('income')) return 'incomeRange';

    return null;
};

/**
 * Deterministic YES/NO handling
 */
export const detectDeterministicUpdate = (
    userMessage: string,
    expectedField: keyof EligibilityState | null
): Partial<EligibilityState> => {
    if (!expectedField) return {};

    const msg = userMessage.toLowerCase().trim();

    if (expectedField === 'isFarmer') {
        if (
            msg === 'no' ||
            msg === 'nope' ||
            msg.includes('not a farmer')
        ) {
            return { isFarmer: false };
        }

        if (
            msg === 'yes' ||
            msg === 'yeah' ||
            msg === 'yep'
        ) {
            return { isFarmer: true };
        }
    }

    return {};
};
