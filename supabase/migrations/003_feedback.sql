-- Migration 003: Feedback (Magic Ear)
-- Stores user frustrations, bug reports, and feature requests directly from the UI

CREATE TABLE IF NOT EXISTS public.feedback (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
    frustration TEXT NOT NULL,
    feature_request TEXT,
    screen TEXT,
    rating INTEGER CHECK (rating >= 1 AND rating <= 5),
    created_at TIMESTAMPTZ DEFAULT now() NOT NULL
);

-- Enable RLS
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- Users can insert their own feedback
CREATE POLICY "Users can submit feedback"
    ON public.feedback
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can view their own feedback history
CREATE POLICY "Users can view own feedback"
    ON public.feedback
    FOR SELECT
    USING (auth.uid() = user_id);
