import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { SUBSCRIPTION_PLAN_DEFAULTS } from "@/lib/stripe/config";

export default function AbonnementPage() {
  return (
    <div className="flex flex-col gap-6">
      <h1 className="text-2xl font-semibold">Abonnement</h1>
      <div className="grid gap-4 sm:grid-cols-2 max-w-2xl">
        {Object.entries(SUBSCRIPTION_PLAN_DEFAULTS).map(([code, plan]) => (
          <Card key={code}>
            <CardHeader>
              <CardTitle>{plan.label}</CardTitle>
              <CardDescription>
                {(plan.amountCents / 100).toFixed(0)}€ HT / mois — {plan.trialDays} jours
                d&apos;essai gratuit
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button disabled className="w-full">
                Bientôt disponible
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
      <p className="text-sm text-muted-foreground max-w-xl">
        Le paiement par abonnement Stripe sera activé une fois le compte Stripe de LocBed
        connecté.
      </p>
    </div>
  );
}
