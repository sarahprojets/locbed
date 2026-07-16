import { requireRole } from "@/features/auth/require-role";

export default async function ProprietaireProfilPage() {
  const { user } = await requireRole("proprietaire");

  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Profil</h1>
      <p className="text-muted-foreground">{user.email}</p>
    </div>
  );
}
