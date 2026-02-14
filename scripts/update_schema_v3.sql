-- Update Schemes Table
ALTER TABLE public.schemes
ADD COLUMN IF NOT EXISTS implementing_department text,
ADD COLUMN IF NOT EXISTS helpline_number text,
ADD COLUMN IF NOT EXISTS application_mode text CHECK (application_mode IN ('online', 'offline', 'both')),
ADD COLUMN IF NOT EXISTS priority_rank int DEFAULT 0;

-- Update Rules Table (Renaming and Adding)
-- Rename appropriate columns if they exist, or add new ones and migrate data if needed.
-- For safety, we will just add the new preferred columns. User can drop old distinct ones later.

ALTER TABLE public.scheme_eligibility_rules
ADD COLUMN IF NOT EXISTS allowed_categories text[], -- Replaces 'category'
ADD COLUMN IF NOT EXISTS allowed_occupations text[], -- Replaces 'occupation'
ADD COLUMN IF NOT EXISTS minority_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS bpl_only boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS excluded_states text[];

-- Migrate data from old columns to new preferred columns if they are null
UPDATE public.scheme_eligibility_rules
SET allowed_categories = category
WHERE allowed_categories IS NULL AND category IS NOT NULL;

UPDATE public.scheme_eligibility_rules
SET allowed_occupations = occupation
WHERE allowed_occupations IS NULL AND occupation IS NOT NULL;

-- Indexing
CREATE INDEX IF NOT EXISTS idx_schemes_priority ON public.schemes(priority_rank);
CREATE INDEX IF NOT EXISTS idx_rules_minority ON public.scheme_eligibility_rules(minority_only);
CREATE INDEX IF NOT EXISTS idx_rules_bpl ON public.scheme_eligibility_rules(bpl_only);
