import Stripe from "stripe";

let stripe: Stripe | null = null;

/** Server-only Stripe client, lazily instantiated so builds don't fail
 * when STRIPE_SECRET_KEY isn't set yet (e.g. before the Stripe account
 * is connected). */
export function getStripe() {
  if (!stripe) {
    if (!process.env.STRIPE_SECRET_KEY) {
      throw new Error("STRIPE_SECRET_KEY is not set");
    }
    stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: "2026-06-24.dahlia",
    });
  }
  return stripe;
}
