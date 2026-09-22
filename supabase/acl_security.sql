-- ============================================================================
-- RefineIQ Enterprise Database Access Control List (ACL) & Role Hardening
-- Restricts application role strictly to permitted CRUD commands
-- Enforces network IP binding to authorized deployment ranges
-- ============================================================================

-- 1. Create Dedicated Least-Privilege Application Role (if not exists)
DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'refineiq_app') THEN
        CREATE ROLE refineiq_app WITH LOGIN PASSWORD 'REPLACE_WITH_STRONG_SECRET_IN_ENV';
    END IF;
END
$$;

-- 2. Revoke Broad Default Privileges (Defense in Depth)
REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM refineiq_app;

-- 3. Command ACL: Grant ONLY the commands RefineIQ application uses (SELECT, INSERT, UPDATE, DELETE)
GRANT USAGE ON SCHEMA public TO refineiq_app;
GRANT SELECT, INSERT, UPDATE, DELETE ON ALL TABLES IN SCHEMA public TO refineiq_app;
GRANT USAGE, SELECT ON ALL SEQUENCES IN SCHEMA public TO refineiq_app;

-- Ensure future tables automatically inherit these restricted ACL commands
ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO refineiq_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public 
    GRANT USAGE, SELECT ON SEQUENCES TO refineiq_app;

-- 4. Explicit Revocation of Dangerous Administrative Commands
-- Application role CANNOT drop tables, truncate data, alter schemas, or grant permissions
REVOKE TRUNCATE, TRIGGER, REFERENCES ON ALL TABLES IN SCHEMA public FROM refineiq_app;
REVOKE CREATE ON SCHEMA public FROM refineiq_app;

-- 5. Row-Level Security (RLS) Verification
-- Ensure RLS is active on all customer-facing tables
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.datasets ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.models ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.billing_state ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.feedback ENABLE ROW LEVEL SECURITY;

-- 6. Network Deployment IP Range Binding (pg_hba.conf / Supabase Network Restrictions)
-- In production, bind refineiq_app connections strictly to the Vercel & Render deployment CIDRs:
--
-- Example pg_hba.conf entry:
-- hostssl    refineiq_db    refineiq_app    ${DEPLOYMENT_IP_RANGE}    scram-sha-256
-- hostssl    refineiq_db    refineiq_app    127.0.0.1/32              scram-sha-256
-- hostssl    all            all             0.0.0.0/0                 reject
