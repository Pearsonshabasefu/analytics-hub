-- =============================================================================
-- REFINEIQ — COMPLETE DATABASE SCHEMA
-- Paste and Run this in: Supabase Dashboard > SQL Editor > New Query
-- =============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 2. CORE USER TABLES
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  workspace_name TEXT DEFAULT 'My Workspace',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.billing_state (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  ocu_balance INTEGER DEFAULT 50 NOT NULL,
  auto_top_up BOOLEAN DEFAULT FALSE,
  max_model_spend INTEGER DEFAULT 20,
  flutterwave_customer_id TEXT,
  stripe_customer_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  ui_settings JSONB DEFAULT '{"theme": "dark", "density": "comfortable"}'::jsonb,
  privacy_settings JSONB DEFAULT '{"shield_default": true, "auto_delete_days": 30}'::jsonb,
  alert_settings JSONB DEFAULT '{"channels": ["email"], "drift_threshold": 15}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.integrations (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  github_token_id UUID,
  aws_s3_key_id UUID,
  google_drive_connected BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. PROJECTS, DATASETS, MODELS
CREATE TABLE IF NOT EXISTS public.projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'created' CHECK (
    status IN ('created', 'ingesting', 'cleaning', 'modeling', 'deploying', 'deployed', 'error')
  ),
  template TEXT CHECK (template IN ('churn_prediction', 'sales_forecasting', NULL)),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source TEXT DEFAULT 'local',
  storage_path TEXT,
  row_count INTEGER,
  column_count INTEGER,
  health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
  pii_masked BOOLEAN DEFAULT FALSE,
  cleaning_recipe JSONB DEFAULT '[]'::jsonb,
  schema_info JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dataset_id UUID REFERENCES public.datasets(id),
  name TEXT NOT NULL,
  algorithm TEXT,
  target_column TEXT,
  task_type TEXT DEFAULT 'classification',
  strategy TEXT DEFAULT 'fast',
  status TEXT DEFAULT 'queued',
  metrics JSONB,
  feature_importance JSONB,
  is_champion BOOLEAN DEFAULT FALSE,
  is_deployed BOOLEAN DEFAULT FALSE,
  api_endpoint TEXT,
  api_key TEXT,
  ocu_cost NUMERIC(10, 2) DEFAULT 0,
  ocu_estimated NUMERIC(10, 2),
  gemini_explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. FEEDBACK (MAGIC EAR)
CREATE TABLE IF NOT EXISTS public.feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES public.profiles(id) ON DELETE CASCADE,
  frustration TEXT NOT NULL,
  feature_request TEXT,
  screen TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  created_at TIMESTAMPTZ DEFAULT NOW() NOT NULL
);

-- 5. ROW LEVEL SECURITY (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Policies (Users can only access their own records)
DO $$
BEGIN
  DROP POLICY IF EXISTS "profiles: own rows only" ON public.profiles;
  CREATE POLICY "profiles: own rows only" ON public.profiles FOR ALL USING (auth.uid() = id);

  DROP POLICY IF EXISTS "billing_state: own rows only" ON public.billing_state;
  CREATE POLICY "billing_state: own rows only" ON public.billing_state FOR ALL USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "user_preferences: own rows only" ON public.user_preferences;
  CREATE POLICY "user_preferences: own rows only" ON public.user_preferences FOR ALL USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "integrations: own rows only" ON public.integrations;
  CREATE POLICY "integrations: own rows only" ON public.integrations FOR ALL USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "projects: own rows only" ON public.projects;
  CREATE POLICY "projects: own rows only" ON public.projects FOR ALL USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "datasets: own rows only" ON public.datasets;
  CREATE POLICY "datasets: own rows only" ON public.datasets FOR ALL USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "models: own rows only" ON public.models;
  CREATE POLICY "models: own rows only" ON public.models FOR ALL USING (auth.uid() = user_id);

  DROP POLICY IF EXISTS "feedback: own rows only" ON public.feedback;
  CREATE POLICY "feedback: own rows only" ON public.feedback FOR ALL USING (auth.uid() = user_id);
END $$;

-- 6. TRIGGER: AUTO-CREATE PROFILE ON AUTH SIGNUP
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  INSERT INTO public.billing_state (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- 7. STORAGE BUCKET: datasets
INSERT INTO storage.buckets (id, name, public)
VALUES ('datasets', 'datasets', false)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  DROP POLICY IF EXISTS "datasets storage: own folder only" ON storage.objects;
  CREATE POLICY "datasets storage: own folder only"
    ON storage.objects FOR ALL
    USING (
      bucket_id = 'datasets'
      AND (storage.foldername(name))[1] = auth.uid()::text
    );
END $$;
