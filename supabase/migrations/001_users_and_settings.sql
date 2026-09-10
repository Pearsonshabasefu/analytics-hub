-- ============================================================
-- Migration 001: Core User Tables
-- Run in Supabase SQL Editor or via: npx supabase db push
-- ============================================================

-- profiles: extends auth.users with app-specific data
CREATE TABLE IF NOT EXISTS public.profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name TEXT,
  avatar_url TEXT,
  workspace_name TEXT DEFAULT 'My Workspace',
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- billing_state: OCU balance and billing config per user
CREATE TABLE IF NOT EXISTS public.billing_state (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  ocu_balance INTEGER DEFAULT 50 NOT NULL,
  auto_top_up BOOLEAN DEFAULT FALSE,
  max_model_spend INTEGER DEFAULT 20,
  stripe_customer_id TEXT,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- user_preferences: UI and privacy settings stored as JSONB
CREATE TABLE IF NOT EXISTS public.user_preferences (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  ui_settings JSONB DEFAULT '{"theme": "dark", "density": "comfortable", "high_contrast": false}'::jsonb,
  privacy_settings JSONB DEFAULT '{"shield_default": true, "auto_delete_days": 30, "mask_rules": {"emails": true, "phones": true, "credit_cards": true, "zip_codes": false}}'::jsonb,
  alert_settings JSONB DEFAULT '{"channels": ["email"], "frequency": "instant", "drift_threshold": 15}'::jsonb,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- integrations: encrypted API key references (keys stored in Supabase Vault)
CREATE TABLE IF NOT EXISTS public.integrations (
  user_id UUID PRIMARY KEY REFERENCES public.profiles(id) ON DELETE CASCADE,
  github_token_id UUID,
  aws_s3_key_id UUID,
  google_drive_connected BOOLEAN DEFAULT FALSE,
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ============================================================
-- Row Level Security (RLS)
-- ============================================================

ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_preferences ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.integrations ENABLE ROW LEVEL SECURITY;

-- Users can only CRUD their own rows
CREATE POLICY "profiles: own rows only"
  ON public.profiles FOR ALL
  USING (auth.uid() = id);

CREATE POLICY "billing_state: own rows only"
  ON public.billing_state FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "user_preferences: own rows only"
  ON public.user_preferences FOR ALL
  USING (auth.uid() = user_id);

CREATE POLICY "integrations: own rows only"
  ON public.integrations FOR ALL
  USING (auth.uid() = user_id);

-- ============================================================
-- Trigger: auto-create profile rows on auth.users insert
-- ============================================================

CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Create profile
  INSERT INTO public.profiles (id, full_name, avatar_url)
  VALUES (
    NEW.id,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'avatar_url'
  )
  ON CONFLICT (id) DO NOTHING;

  -- Create default billing state (50 free OCUs)
  INSERT INTO public.billing_state (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  -- Create default preferences (dark mode, privacy shield ON)
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;

  RETURN NEW;
END;
$$;

-- Attach trigger to auth.users
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();
