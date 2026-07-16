import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const STATS = [
  { label: "Vues", value: "0" },
  { label: "Favoris", value: "0" },
  { label: "Réservations", value: "0" },
  { label: "Taux de réponse", value: "—" },
];

export default function ProprietaireDashboardPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Tableau de bord</h1>
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {STATS.map((stat) => (
          <Card key={stat.label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-normal text-muted-foreground">
                {stat.label}
              </CardTitle>
            </CardHeader>
            <CardContent className="text-2xl font-semibold">{stat.value}</CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
