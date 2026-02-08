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
    is_active: boolean;
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
        .select('id, name, short_description, categories, state_type, is_active')
        .eq('is_active', true)
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
