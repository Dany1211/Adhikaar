/**
 * conversationController.ts
 *
 * Deterministic brain of the eligibility assistant.
 */

import { EligibilityState } from './eligibilityState';

export const getNextQuestion = (state: EligibilityState): keyof EligibilityState | 'done' => {
    if (state.age === null) return 'age';
    if (state.gender === null) return 'gender';
    if (state.state === null) return 'state';
    if (state.isFarmer === null && state.occupation === null) return 'occupation'; // Ask occupation first, might infer farmer
    if (state.occupation === null) return 'occupation';
    if (state.income === null && state.incomeRange === null) return 'income';

    // Optional / Advanced fields
    if (state.caste === null) return 'caste';
    if (state.maritalStatus === null) return 'maritalStatus';

    return 'done';
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
