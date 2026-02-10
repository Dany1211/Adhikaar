/**
 * eligibilityState.ts
 *
 * Single source of truth for eligibility data.
 */

export interface EligibilityState {
    age: number | null;
    gender: 'male' | 'female' | 'other' | null;
    state: string | null;
    occupation: string | null;
    incomeRange: '<1L' | '1-3L' | '3-5L' | '>5L' | null;
    isFarmer: boolean | null;
}

export const initialEligibilityState: EligibilityState = {
    age: null,
    gender: null,
    state: null,
    occupation: null,
    incomeRange: null,
    isFarmer: null,
};
