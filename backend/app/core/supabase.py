from supabase import create_client, Client
from app.core.config import settings
from functools import lru_cache


@lru_cache(maxsize=1)
def get_supabase_admin() -> Client:
    """
    Returns a Supabase client with service role key.
    Use for server-side operations that bypass RLS.
    Never expose this client to the frontend.
    """
    return create_client(settings.SUPABASE_URL, settings.SUPABASE_SERVICE_KEY)


def get_supabase_user(jwt_token: str) -> Client:
    """
    Returns a Supabase client authenticated as a specific user.
    Respects RLS — user can only see their own data.
    """
    client = create_client(settings.SUPABASE_URL, settings.SUPABASE_ANON_KEY)
    client.auth.set_session(jwt_token, "")
    return client
