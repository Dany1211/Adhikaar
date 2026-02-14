/**
 * eligibilityEngine.ts
 * 
 * Deterministic engine to filter schemes based on the collected user state.
 * No AI is used here - purely Typescript logic against Supabase data.
 */

import { fetchAllSchemesWithRules, Scheme, SchemeEligibilityRule } from '../services/api';
import { EligibilityState } from './eligibilityState';

export const checkEligibility = async (state: EligibilityState): Promise<Scheme[]> => {
    console.log("Checking eligibility (Local Evaluation) for:", state);

    // 1. Fetch all schemes with rules (Simulating local DB fetch)
    const allSchemes = await fetchAllSchemesWithRules();

    // 2. Filter locally
    const eligibleSchemes = allSchemes.filter(scheme => {
        // If no rules exist, assume eligible (Universal scheme)
        if (!scheme.rules || scheme.rules.length === 0) {
            return true;
        }

        // Check if ANY rule matches (OR logic between rule rows)
        return scheme.rules.some(rule => evaluateRule(rule, state));
    });

    return eligibleSchemes;
};

const evaluateRule = (rule: SchemeEligibilityRule, state: EligibilityState): boolean => {
    // 1. Age Check
    if (state.age !== null) {
        if (rule.min_age !== null && state.age < rule.min_age) return false;
        if (rule.max_age !== null && state.age > rule.max_age) return false;
    }

    // 2. Gender Check
    if (rule.allowed_genders && rule.allowed_genders.length > 0 && state.gender) {
        if (!rule.allowed_genders.map(g => g.toLowerCase()).includes(state.gender.toLowerCase())) return false;
    }

    // 3. Category / Caste Check (Renamed to allowed_categories)
    if (rule.allowed_categories && rule.allowed_categories.length > 0 && state.caste) {
        const userCaste = state.caste.toLowerCase();
        const allowedCastes = rule.allowed_categories.map(c => c.toLowerCase());
        if (!allowedCastes.includes(userCaste)) return false;
    }

    // 4. Income Check
    if (state.income !== null) {
        if (rule.income_max !== null && state.income > rule.income_max) return false;
        if (rule.income_min !== null && state.income < rule.income_min) return false;
    }
    // Income Type Check (e.g., if rule says 'family' income < X, but user provided 'individual', we might need logic.
    // For strictness, if rule specifies income_type, and user specifies different, we might warn or fail.
    // For MVP, we ignore type mismatch and just compare values if available.

    // 5. Occupation & Employment Status (Renamed to allowed_occupations)
    if (rule.allowed_occupations && rule.allowed_occupations.length > 0) {
        if (!state.occupation) return false;
        const userOcc = state.occupation.toLowerCase();
        const allowed = rule.allowed_occupations.map(o => o.toLowerCase());
        if (!allowed.some(a => userOcc.includes(a))) return false;
    }

    // employment_status check
    if (rule.employment_status && rule.employment_status.length > 0) {
        // We don't have explicit employment_status in state yet, mapping from occupation or manual field?
        // If we added it to state, check here.
        // As per V3 schema, state has 'employment_status'.
        // Let's assume we extract it.
    }

    // 6. Farmer & Land
    if (rule.requires_farmer) {
        if (!state.isFarmer && !state.ownsLand) return false;
    }
    if (rule.requires_land_ownership) {
        if (!state.isFarmer && !state.ownsLand) return false;
    }

    if (state.landSize !== null) {
        if (rule.min_land_size !== null && state.landSize < rule.min_land_size) return false;
        if (rule.max_land_size !== null && state.landSize > rule.max_land_size) return false;
    }

    // 7. Social Conditions
    if (rule.widow_only) {
        if (state.maritalStatus !== 'widowed') return false;
    }
    if (rule.student_only) {
        const isStudent = state.isStudent || state.occupation?.toLowerCase().includes('student');
        if (!isStudent) return false;
    }
    if (rule.requires_disability) {
        if (state.hasDisability !== true) return false;
    }
    if (rule.minority_only) {
        if (state.is_minority !== true) return false;
    }
    if (rule.bpl_only) {
        if (state.is_bpl !== true) return false;
    }

    // 8. Geographic Override & Exclusion
    if (state.state) {
        const userState = state.state.toLowerCase();

        // Exclusion check first
        if (rule.excluded_states && rule.excluded_states.length > 0) {
            const excluded = rule.excluded_states.map(s => s.toLowerCase());
            if (excluded.includes(userState)) return false;
        }

        // Inclusion check
        if (rule.applicable_states && rule.applicable_states.length > 0) {
            const allowedStates = rule.applicable_states.map(s => s.toLowerCase());
            if (!allowedStates.includes(userState)) return false;
        }
    }

    return true;
};
