import createIntlMiddleware from "next-intl/middleware";
import { NextResponse, type NextRequest } from "next/server";
import { routing } from "@/i18n/routing";
import { updateSession } from "@/lib/supabase/middleware";

const intlMiddleware = createIntlMiddleware(routing);

const ROLE_PREFIX_MAP: Record<string, "voyageur" | "proprietaire" | "admin"> = {
  compte: "voyageur",
  proprietaire: "proprietaire",
  admin: "admin",
};

function stripLocale(pathname: string) {
  const [, first, ...rest] = pathname.split("/");
  if (routing.locales.includes(first as (typeof routing.locales)[number])) {
    return "/" + rest.join("/");
  }
  return pathname;
}

export default async function middleware(request: NextRequest) {
  // 1. Locale negotiation/redirect first — produces the response we then
  // attach refreshed Supabase cookies to.
  const intlResponse = intlMiddleware(request);

  const pathWithoutLocale = stripLocale(request.nextUrl.pathname);
  const segment = pathWithoutLocale.split("/")[1];
  const requiredRole = ROLE_PREFIX_MAP[segment];

  if (!requiredRole) {
    return intlResponse;
  }

  const { user, response } = await updateSession(request, intlResponse);

  if (!user) {
    const loginUrl = new URL(request.nextUrl.pathname, request.url);
    loginUrl.pathname = loginUrl.pathname.replace(pathWithoutLocale, "/login");
    loginUrl.searchParams.set("redirect", request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  const role = (user.app_metadata?.role as string | undefined) ?? "voyageur";

  if (role !== requiredRole && role !== "admin") {
    const home = new URL(request.nextUrl.pathname, request.url);
    home.pathname = home.pathname.replace(
      pathWithoutLocale,
      role === "proprietaire" ? "/proprietaire" : "/compte",
    );
    return NextResponse.redirect(home);
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next|api|.*\\..*).*)"],
};
