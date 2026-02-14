-- Add new columns for enhanced eligibility rules
ALTER TABLE public.scheme_eligibility_rules
ADD COLUMN IF NOT EXISTS allowed_genders text[], -- ['male', 'female', 'other']
ADD COLUMN IF NOT EXISTS income_min numeric,
ADD COLUMN IF NOT EXISTS income_type text CHECK (income_type IN ('individual', 'family')),
ADD COLUMN IF NOT EXISTS employment_status text[], -- e.g., ['unemployed', 'self-employed', 'salaried']
ADD COLUMN IF NOT EXISTS requires_farmer boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS min_land_size numeric,
ADD COLUMN IF NOT EXISTS max_land_size numeric,
ADD COLUMN IF NOT EXISTS widow_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS student_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS applicable_states text[];

-- Add indexes for new columns
CREATE INDEX IF NOT EXISTS idx_scheme_rules_income_min ON public.scheme_eligibility_rules(income_min);
CREATE INDEX IF NOT EXISTS idx_scheme_rules_requires_farmer ON public.scheme_eligibility_rules(requires_farmer);
CREATE INDEX IF NOT EXISTS idx_scheme_rules_widow_only ON public.scheme_eligibility_rules(widow_only);
CREATE INDEX IF NOT EXISTS idx_scheme_rules_student_only ON public.scheme_eligibility_rules(student_only);

-- Comment on new columns
COMMENT ON COLUMN public.scheme_eligibility_rules.allowed_genders IS 'List of genders eligible for this scheme';
COMMENT ON COLUMN public.scheme_eligibility_rules.min_land_size IS 'Minimum land holding required in acres';
COMMENT ON COLUMN public.scheme_eligibility_rules.max_land_size IS 'Maximum land holding allowed in acres';
