import { createServerClient } from "@supabase/ssr";
import { NextResponse, type NextRequest } from "next/server";

/**
 * Refreshes the Supabase session and returns both the (possibly
 * unauthenticated) user and the response carrying refreshed cookies.
 * Role-based redirects happen in the caller (src/middleware.ts) since
 * this needs to compose with next-intl's own response.
 */
export async function updateSession(request: NextRequest, response: NextResponse) {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  // Supabase isn't connected yet (Phase 1 can build/run without it) — treat
  // as unauthenticated rather than crashing every role-protected route.
  if (!supabaseUrl || !supabaseAnonKey) {
    return { user: null, response };
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options),
          );
        },
      },
    },
  );

  const {
    data: { user },
  } = await supabase.auth.getUser();

  return { user, response };
}
