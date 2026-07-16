"use server";

import { revalidatePath } from "next/cache";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireRole } from "@/features/auth/require-role";

export async function setUserSuspended(userId: string, suspended: boolean) {
  await requireRole("admin");
  const supabase = createAdminClient();
  await supabase.from("profiles").update({ is_suspended: suspended }).eq("id", userId);
  revalidatePath("/admin/utilisateurs");
}

export async function setUserRole(userId: string, role: "voyageur" | "proprietaire" | "admin") {
  await requireRole("admin");
  const supabase = createAdminClient();
  await supabase.from("profiles").update({ role }).eq("id", userId);
  revalidatePath("/admin/utilisateurs");
}

export async function setListingStatus(
  listingId: string,
  status: "published" | "suspended" | "archived",
) {
  await requireRole("admin");
  const supabase = createAdminClient();
  await supabase.from("listings").update({ status }).eq("id", listingId);
  revalidatePath("/admin/logements");
}
