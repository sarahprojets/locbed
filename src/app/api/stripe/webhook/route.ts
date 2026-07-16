import { NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { getStripe } from "@/lib/stripe/client";
import { createAdminClient } from "@/lib/supabase/admin";
import type { ListingType, SubscriptionStatus } from "@/types/database.types";

export async function POST(request: NextRequest) {
  const stripe = getStripe();
  const signature = request.headers.get("stripe-signature");
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!signature || !webhookSecret) {
    return NextResponse.json({ error: "missing_signature" }, { status: 400 });
  }

  const body = await request.text();
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, webhookSecret);
  } catch {
    return NextResponse.json({ error: "invalid_signature" }, { status: 400 });
  }

  const supabase = createAdminClient();

  // Idempotency guard: Stripe may deliver the same event more than once.
  const { error: insertError } = await supabase
    .from("stripe_webhook_events")
    .insert({ stripe_event_id: event.id, type: event.type, payload: event as never });

  if (insertError) {
    // Unique violation on stripe_event_id means we've already processed this event.
    return NextResponse.json({ received: true, deduplicated: true });
  }

  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object as Stripe.Checkout.Session;
      const ownerId = session.metadata?.owner_id;
      const listingId = session.metadata?.listing_id || null;
      const planCode = session.metadata?.plan_code;

      if (ownerId && session.customer && session.subscription) {
        await supabase
          .from("profiles")
          .update({ stripe_customer_id: String(session.customer) })
          .eq("id", ownerId);

        const { data: plan } = await supabase
          .from("subscription_plans")
          .select("id")
          .eq("code", toListingType(planCode))
          .single();

        if (plan) {
          const subscription = await stripe.subscriptions.retrieve(String(session.subscription));
          await upsertSubscription(supabase, subscription, ownerId, plan.id, listingId);
        }
      }
      break;
    }

    case "customer.subscription.created":
    case "customer.subscription.updated":
    case "customer.subscription.deleted": {
      const subscription = event.data.object as Stripe.Subscription;
      const ownerId = subscription.metadata?.owner_id;
      const listingId = subscription.metadata?.listing_id || null;
      const planCode = subscription.metadata?.plan_code;

      if (ownerId) {
        const { data: plan } = await supabase
          .from("subscription_plans")
          .select("id")
          .eq("code", toListingType(planCode))
          .single();

        if (plan) {
          await upsertSubscription(supabase, subscription, ownerId, plan.id, listingId);
        }
      }
      break;
    }

    case "invoice.payment_failed": {
      // Subscription `status` transitions to `past_due`/`unpaid` on Stripe's
      // side too, which the customer.subscription.updated event above
      // already syncs — nothing extra to do here in Phase 1 besides having
      // logged the event for the future "email on payment failure" flow.
      break;
    }

    default:
      break;
  }

  return NextResponse.json({ received: true });
}

// Stripe has a couple of statuses (incomplete_expired, paused) our DB enum
// doesn't model in Phase 1 — collapse them to the closest equivalent so the
// upsert never fails on an invalid enum value.
function toListingType(planCode: string | undefined): ListingType {
  return planCode === "maison" ? "maison" : "appartement";
}

function mapStripeStatus(status: Stripe.Subscription.Status): SubscriptionStatus {
  if (status === "incomplete_expired") return "incomplete";
  if (status === "paused") return "canceled";
  return status;
}

async function upsertSubscription(
  supabase: ReturnType<typeof createAdminClient>,
  subscription: Stripe.Subscription,
  ownerId: string,
  planId: string,
  listingId: string | null,
) {
  const item = subscription.items.data[0];

  await supabase.from("subscriptions").upsert(
    {
      owner_id: ownerId,
      listing_id: listingId,
      plan_id: planId,
      stripe_customer_id: String(subscription.customer),
      stripe_subscription_id: subscription.id,
      status: mapStripeStatus(subscription.status),
      trial_start: subscription.trial_start
        ? new Date(subscription.trial_start * 1000).toISOString()
        : null,
      trial_end: subscription.trial_end
        ? new Date(subscription.trial_end * 1000).toISOString()
        : null,
      current_period_start: item
        ? new Date(item.current_period_start * 1000).toISOString()
        : null,
      current_period_end: item ? new Date(item.current_period_end * 1000).toISOString() : null,
      cancel_at_period_end: subscription.cancel_at_period_end,
    },
    { onConflict: "stripe_subscription_id" },
  );

  if (listingId) {
    const isActive = subscription.status === "active" || subscription.status === "trialing";
    await supabase
      .from("listings")
      .update({ status: isActive ? "published" : "suspended" })
      .eq("id", listingId);
  }
}
