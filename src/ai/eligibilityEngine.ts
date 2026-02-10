/**
 * eligibilityEngine.ts
 * 
 * Deterministic engine to filter schemes based on the collected user state.
 * No AI is used here - purely Typescript logic against Supabase data.
 */

import { fetchSchemes, Scheme } from '../services/api';
import { EligibilityState } from './eligibilityState';

export const checkEligibility = async (state: EligibilityState): Promise<Scheme[]> => {
    console.log("Checking eligibility for:", state);

    // 1. Fetch all active schemes
    const allSchemes = await fetchSchemes();

    // 2. Filter logic
    return allSchemes.filter(scheme => {
        // Basic filtering logic (Extend based on actual scheme data structure)
        // Here we mock the logic since we don't have detailed criteria in the Scheme type yet.
        // In a real app, 'Scheme' would have 'min_age', 'required_occupation', etc.

        // For demonstration, let's assume loose matching based on keywords in description/name
        const text = (scheme.name + ' ' + scheme.short_description).toLowerCase();

        let matches = true;

        if (state.isFarmer && !text.includes('farmer') && !text.includes('kisan')) {
            // If scheme is strictly for farmers, we might check differently.
            // But here, if the USER is a farmer, they should see farmer schemes.
            // Accessing farmer schemes:
            if (text.includes('student')) matches = false;
        }

        if (state.occupation?.toLowerCase() === 'student') {
            if (!text.includes('student') && !text.includes('scholarship')) matches = false;
        }

        // State filtering (Assuming scheme has a 'state' field or we check text)
        // Note: The current API 'Scheme' interface has { state_type: 'central' | 'state' }
        // If it's a state scheme, we should ideally check if it matches the user's state.
        // However, the current Scheme interface doesn't strictly have the state name.
        // We will pass Central schemes always.

        // Return matching schemes
        return matches;
    });
};
