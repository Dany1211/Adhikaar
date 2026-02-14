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
    isFarmer: boolean | null; // Kept for backward compat
    ownsLand: boolean | null; // New schema alignment
    landSize: number | null; // Acres
    hasDisability: boolean | null; // New schema alignment
    maritalStatus: 'single' | 'married' | 'widowed' | 'divorced' | null;
    caste: 'sc' | 'st' | 'obc' | 'general' | 'ews' | null;
    isStudent: boolean | null;
    income: number | null; // Normalized annual income
    income_type: 'individual' | 'family' | null;
    is_minority: boolean | null;
    is_bpl: boolean | null;
}

export const initialEligibilityState: EligibilityState = {
    age: null,
    gender: null,
    state: null,
    occupation: null,
    incomeRange: null,
    isFarmer: null,
    ownsLand: null,
    landSize: null,
    hasDisability: null,
    maritalStatus: null,
    caste: null,
    isStudent: null,
    income: null,
    income_type: null,
    is_minority: null,
    is_bpl: null,
};
