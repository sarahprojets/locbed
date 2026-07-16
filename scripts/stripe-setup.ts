/**
 * One-time idempotent setup: creates the Stripe Products/Prices for
 * LocBed's two subscription plans and writes the resulting IDs into
 * subscription_plans. Safe to re-run — looks up existing products by
 * metadata.plan_code before creating new ones.
 *
 * Usage: npx tsx scripts/stripe-setup.ts
 * Requires STRIPE_SECRET_KEY, NEXT_PUBLIC_SUPABASE_URL and
 * SUPABASE_SERVICE_ROLE_KEY in the environment.
 */
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";
import { SUBSCRIPTION_PLAN_DEFAULTS } from "../src/lib/stripe/config";

async function main() {
  const stripe = new Stripe(requireEnv("STRIPE_SECRET_KEY"), {
    apiVersion: "2026-06-24.dahlia",
  });
  const supabase = createClient(
    requireEnv("NEXT_PUBLIC_SUPABASE_URL"),
    requireEnv("SUPABASE_SERVICE_ROLE_KEY"),
  );

  for (const [code, plan] of Object.entries(SUBSCRIPTION_PLAN_DEFAULTS)) {
    const existing = await stripe.products.search({
      query: `metadata['plan_code']:'${code}'`,
    });

    const product =
      existing.data[0] ??
      (await stripe.products.create({
        name: `LocBed — Abonnement ${plan.label}`,
        metadata: { plan_code: code },
      }));

    const prices = await stripe.prices.list({ product: product.id, active: true });
    const price =
      prices.data.find(
        (p) => p.unit_amount === plan.amountCents && p.currency === plan.currency,
      ) ??
      (await stripe.prices.create({
        product: product.id,
        unit_amount: plan.amountCents,
        currency: plan.currency,
        recurring: { interval: "month" },
      }));

    const { error } = await supabase
      .from("subscription_plans")
      .update({
        stripe_product_id: product.id,
        stripe_price_id: price.id,
        amount_cents: plan.amountCents,
        trial_days: plan.trialDays,
      })
      .eq("code", code);

    if (error) throw error;

    console.log(`✔ ${code}: product=${product.id} price=${price.id}`);
  }
}

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
