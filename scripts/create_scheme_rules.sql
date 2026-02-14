-- Enable UUID extension if not enabled
create extension if not exists "uuid-ossp";

-- Create the scheme_eligibility_rules table
create table if not exists public.scheme_eligibility_rules (
    id uuid primary key default uuid_generate_v4(),
    scheme_id uuid not null references public.schemes(id) on delete cascade,
    min_age integer,
    max_age integer,
    income_max numeric,
    occupation text[], -- e.g., ['farmer', 'student']
    category text[],   -- e.g., ['sc', 'st', 'obc', 'general']
    requires_land_ownership boolean default false,
    requires_disability boolean default false,
    created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Add indexes for better query performance
create index if not exists idx_scheme_rules_min_age on public.scheme_eligibility_rules(min_age);
create index if not exists idx_scheme_rules_max_age on public.scheme_eligibility_rules(max_age);
create index if not exists idx_scheme_rules_income_max on public.scheme_eligibility_rules(income_max);
create index if not exists idx_scheme_rules_occupation on public.scheme_eligibility_rules using gin(occupation);
create index if not exists idx_scheme_rules_category on public.scheme_eligibility_rules using gin(category);

-- Comment on table
comment on table public.scheme_eligibility_rules is 'Stores deterministic eligibility criteria for schemes.';
