import { supabase } from './supabase';

export interface Category {
    id: string;
    label: string;
}

export interface Scheme {
    id: string;
    name: string;
    short_description: string;
    long_description?: string;
    benefits?: string;
    categories: string[];
    state_type: 'central' | 'state';
    implementing_department?: string;
    application_mode?: 'online' | 'offline' | 'both';
    helpline_number?: string;
    priority_rank?: number;
    applicable_states?: string[];
    is_active: boolean;
    official_link?: string;
}

export const fetchCategories = async (): Promise<Category[]> => {
    const { data, error } = await supabase
        .from('scheme_categories')
        .select('*');

    if (error) {
        console.error('Error fetching categories:', error);
        return [];
    }
    return data || [];
};

export const fetchSchemes = async (): Promise<Scheme[]> => {
    const { data, error } = await supabase
        .from('schemes')
        .select('id, name, short_description, categories, state_type, is_active, priority_rank')
        .eq('is_active', true)
        .order('priority_rank', { ascending: false })
        .order('created_at', { ascending: false });

    if (error) {
        console.error('Error fetching schemes:', error);
        return [];
    }
    return data || [];
};

export const fetchSchemeDetails = async (id: string): Promise<Scheme | null> => {
    const { data, error } = await supabase
        .from('schemes')
        .select('*')
        .eq('id', id)
        .single();

    if (error) {
        console.error(`Error fetching scheme details for ${id}:`, error);
        return null;
    }
    return data;
};

export interface SchemeEligibilityRule {
    id: string;
    scheme_id: string;
    min_age: number | null;
    max_age: number | null;
    allowed_genders: string[] | null;
    allowed_categories: string[] | null; // Replaces 'category'
    income_min: number | null;
    income_max: number | null;
    income_type: 'individual' | 'family' | null;
    allowed_occupations: string[] | null; // Replaces 'occupation'
    employment_status: string[] | null;
    requires_land_ownership: boolean;
    requires_farmer: boolean;
    min_land_size: number | null;
    max_land_size: number | null;
    requires_disability: boolean;
    widow_only: boolean;
    student_only: boolean;
    minority_only: boolean;
    bpl_only: boolean;
    applicable_states: string[] | null;
    excluded_states: string[] | null;
}

// Composite type for internal use
export interface SchemeWithRules extends Scheme {
    rules?: SchemeEligibilityRule[];
}

/**
 * Fetches ALL schemes and their associated rules for LOCAL evaluation.
 * Adapting to Offline-First architecture.
 */
export const fetchAllSchemesWithRules = async (): Promise<SchemeWithRules[]> => {
    console.log("Fetching all schemes and rules for local evaluation...");

    const { data, error } = await supabase
        .from('schemes')
        .select(`
            *,
            scheme_eligibility_rules (*)
        `)
        .eq('is_active', true);

    if (error) {
        console.error('Error fetching schemes with rules:', error);
        return [];
    }

    // Transform to SchemeWithRules
    const schemes: SchemeWithRules[] = data?.map((item: any) => ({
        ...item,
        rules: item.scheme_eligibility_rules,
    })) || [];

    return schemes;
};
