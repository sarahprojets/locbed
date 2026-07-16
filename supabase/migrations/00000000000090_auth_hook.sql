-- Custom Access Token Hook: copies profiles.role into the JWT's
-- app_metadata so RLS policies (public.current_user_role()) and the
-- Next.js middleware can read role without an extra DB round-trip.
--
-- This function must additionally be wired up manually in the Supabase
-- Dashboard: Authentication -> Hooks -> Customize Access Token (JWT)
-- Claims hook -> select public.custom_access_token_hook. Cannot be done
-- via migration alone.
--
-- Caveat: the JWT only refreshes periodically (or on next sign-in), so a
-- role change made by an admin needs a forced session refresh on the
-- client to take effect immediately.
create or replace function public.custom_access_token_hook(event jsonb)
returns jsonb
language plpgsql
stable
as $$
declare
  claims jsonb;
  user_role public.user_role;
begin
  select role into user_role from public.profiles where id = (event ->> 'user_id')::uuid;

  claims := event -> 'claims';

  if user_role is not null then
    claims := jsonb_set(claims, '{app_metadata,role}', to_jsonb(user_role::text));
  else
    claims := jsonb_set(claims, '{app_metadata,role}', '"voyageur"');
  end if;

  event := jsonb_set(event, '{claims}', claims);
  return event;
end;
$$;

grant usage on schema public to supabase_auth_admin;
grant execute on function public.custom_access_token_hook to supabase_auth_admin;
revoke execute on function public.custom_access_token_hook from authenticated, anon, public;

grant select on public.profiles to supabase_auth_admin;

create policy "auth_admin_read_role" on public.profiles
  for select to supabase_auth_admin using (true);
