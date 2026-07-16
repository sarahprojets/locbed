import { Users } from "lucide-react";
import { EmptyState } from "@/components/shared/empty-state";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { createAdminClient } from "@/lib/supabase/admin";
import { UserRowActions } from "@/features/admin/user-row-actions";

export default async function AdminUtilisateursPage() {
  const supabase = createAdminClient();
  const { data: profiles } = await supabase
    .from("profiles")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(100);

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Utilisateurs</h1>
      {!profiles || profiles.length === 0 ? (
        <EmptyState icon={Users} title="Aucun utilisateur" description="Les inscriptions apparaîtront ici." />
      ) : (
        <div className="flex flex-col divide-y rounded-xl border">
          {profiles.map((profile) => (
            <div key={profile.id} className="flex items-center gap-3 p-4">
              <Avatar>
                <AvatarImage src={profile.avatar_url ?? undefined} />
                <AvatarFallback>{profile.display_name?.[0]?.toUpperCase() ?? "?"}</AvatarFallback>
              </Avatar>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium">{profile.display_name ?? "Sans nom"}</p>
                <p className="text-sm text-muted-foreground">
                  Inscrit le {new Date(profile.created_at).toLocaleDateString("fr-FR")}
                </p>
              </div>
              <Badge variant="outline">{profile.role}</Badge>
              {profile.identity_verification_status === "verified" ? (
                <Badge>Vérifié</Badge>
              ) : null}
              {profile.is_suspended ? <Badge variant="destructive">Suspendu</Badge> : null}
              <UserRowActions
                userId={profile.id}
                isSuspended={profile.is_suspended}
                role={profile.role}
              />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
