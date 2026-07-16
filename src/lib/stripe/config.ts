export const SUBSCRIPTION_PLAN_CODES = ["appartement", "maison"] as const;
export type SubscriptionPlanCode = (typeof SUBSCRIPTION_PLAN_CODES)[number];

/** Source of truth for seeding `subscription_plans` (see scripts/stripe-setup.ts).
 * Actual billing price/trial length is read from the DB at checkout time —
 * these are only the initial values to create in Stripe + seed the table. */
export const SUBSCRIPTION_PLAN_DEFAULTS: Record<
  SubscriptionPlanCode,
  { label: string; amountCents: number; currency: "eur"; trialDays: number }
> = {
  appartement: { label: "Appartement", amountCents: 900, currency: "eur", trialDays: 30 },
  maison: { label: "Maison", amountCents: 1400, currency: "eur", trialDays: 30 },
};
