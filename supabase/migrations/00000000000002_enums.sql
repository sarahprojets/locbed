create type public.user_role as enum ('voyageur', 'proprietaire', 'admin');

create type public.listing_type as enum ('appartement', 'maison');

create type public.listing_status as enum ('draft', 'published', 'archived', 'suspended');

create type public.booking_request_status as enum (
  'pending', 'accepted', 'refused', 'countered', 'cancelled', 'expired', 'waitlisted'
);

create type public.review_type as enum ('listing_review', 'traveler_review');

create type public.review_status as enum ('pending', 'published', 'rejected', 'hidden');

create type public.subscription_status as enum (
  'trialing', 'active', 'past_due', 'canceled', 'incomplete', 'unpaid'
);

create type public.verification_status as enum ('unverified', 'pending', 'verified', 'rejected');
