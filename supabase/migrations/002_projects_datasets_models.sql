-- ============================================================
-- Migration 002: Projects, Datasets, Models
-- ============================================================

-- projects: top-level containers for each analysis project
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

-- datasets: files/connections attached to a project
CREATE TABLE IF NOT EXISTS public.datasets (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  source TEXT DEFAULT 'local' CHECK (
    source IN ('local', 'google_drive', 'snowflake', 'bigquery', 's3', 'sql', 'mongodb', 'web_scrape', 'api')
  ),
  storage_path TEXT,
  row_count INTEGER,
  column_count INTEGER,
  health_score INTEGER CHECK (health_score BETWEEN 0 AND 100),
  pii_masked BOOLEAN DEFAULT FALSE,
  cleaning_recipe JSONB DEFAULT '[]'::jsonb,
  schema_info JSONB,            -- column names, types, stats
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- models: trained ML models per project
CREATE TABLE IF NOT EXISTS public.models (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  project_id UUID NOT NULL REFERENCES public.projects(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES public.profiles(id) ON DELETE CASCADE,
  dataset_id UUID REFERENCES public.datasets(id),
  name TEXT NOT NULL,
  algorithm TEXT CHECK (
    algorithm IN ('logistic_regression', 'random_forest', 'xgboost', 'lightgbm', 'linear_regression')
  ),
  target_column TEXT,
  task_type TEXT CHECK (task_type IN ('classification', 'regression')),
  strategy TEXT DEFAULT 'fast' CHECK (strategy IN ('fast', 'high_accuracy')),
  status TEXT DEFAULT 'queued' CHECK (
    status IN ('queued', 'training', 'complete', 'failed')
  ),
  metrics JSONB,                -- {"accuracy": 0.94, "f1": 0.91, "auc": 0.96, "rmse": null}
  feature_importance JSONB,     -- [{column, importance_score}]
  shapley_values JSONB,
  bias_report JSONB,
  is_champion BOOLEAN DEFAULT FALSE,
  is_deployed BOOLEAN DEFAULT FALSE,
  api_endpoint TEXT,
  api_key TEXT,
  ocu_cost NUMERIC(10, 2) DEFAULT 0,
  ocu_estimated NUMERIC(10, 2),
  modal_job_id TEXT,
  gemini_explanation TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security
-- ============================================================

ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;

CREATE POLICY "projects: own rows only"
  ON public.projects FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "datasets: own rows only"
  ON public.datasets FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "models: own rows only"
  ON public.models FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- Supabase Storage: datasets bucket
-- ============================================================

-- Run this in Supabase Dashboard > Storage > New Bucket
-- Name: datasets, Private (not public)
-- Or via API:
-- INSERT INTO storage.buckets (id, name, public) VALUES ('datasets', 'datasets', false);

-- Storage RLS: users can only access their own folder
CREATE POLICY "datasets storage: own folder only"
  ON storage.objects FOR ALL
  USING (
    bucket_id = 'datasets'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
