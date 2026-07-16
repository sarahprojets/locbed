import { NextResponse, type NextRequest } from "next/server";
import { getStripe } from "@/lib/stripe/client";
import { createClient } from "@/lib/supabase/server";
import type { ListingType } from "@/types/database.types";

export async function POST(request: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const { listingId, planCode } = (await request.json()) as {
    listingId: string;
    planCode: ListingType;
  };

  const { data: plan } = await supabase
    .from("subscription_plans")
    .select("stripe_price_id, trial_days")
    .eq("code", planCode)
    .single();

  if (!plan?.stripe_price_id) {
    return NextResponse.json(
      { error: "plan_not_configured", message: "Run scripts/stripe-setup.ts first." },
      { status: 503 },
    );
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? request.nextUrl.origin;
  const stripe = getStripe();

  const { data: profile } = await supabase
    .from("profiles")
    .select("stripe_customer_id")
    .eq("id", user.id)
    .single();

  const session = await stripe.checkout.sessions.create({
    mode: "subscription",
    customer: profile?.stripe_customer_id ?? undefined,
    customer_email: profile?.stripe_customer_id ? undefined : (user.email ?? undefined),
    line_items: [{ price: plan.stripe_price_id, quantity: 1 }],
    subscription_data: { trial_period_days: plan.trial_days },
    metadata: { listing_id: listingId, owner_id: user.id, plan_code: planCode },
    success_url: `${siteUrl}/proprietaire/abonnement?checkout=success`,
    cancel_url: `${siteUrl}/proprietaire/abonnement?checkout=cancelled`,
  });

  return NextResponse.json({ url: session.url });
}
