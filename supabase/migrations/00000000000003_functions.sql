-- Generic updated_at trigger, applied per-table below.
create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

-- Reads role from the JWT (populated by the custom access token hook, see
-- 00000000000090_auth_hook.sql) instead of joining profiles, to avoid
-- recursive-RLS issues when profiles' own policies call this function.
create or replace function public.current_user_role()
returns public.user_role
language sql
stable
security definer
set search_path = public
as $$
  select coalesce(
    nullif(current_setting('request.jwt.claims', true), '')::jsonb
      -> 'app_metadata' ->> 'role',
    'voyageur'
  )::public.user_role;
$$;
