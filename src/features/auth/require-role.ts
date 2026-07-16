import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

/**
 * Redundant server-side guard for role-scoped layouts. The middleware
 * (src/middleware.ts) already blocks the wrong role at the edge — this is
 * belt-and-suspenders defense in depth, not the source of truth (that's
 * Postgres RLS).
 */
export async function requireRole(role: "voyageur" | "proprietaire" | "admin") {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  const userRole = profile?.role ?? "voyageur";
  if (userRole !== role && userRole !== "admin") {
    redirect(userRole === "proprietaire" ? "/proprietaire" : "/compte");
  }

  return { user, role: userRole };
}
