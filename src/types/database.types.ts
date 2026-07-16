// Hand-written to match supabase/migrations/*.sql. Regenerate once the
// Supabase project is linked (this becomes a mechanical diff at that point):
//   npx supabase gen types typescript --linked > src/types/database.types.ts
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type UserRole = "voyageur" | "proprietaire" | "admin";
export type ListingType = "appartement" | "maison";
export type ListingStatus = "draft" | "published" | "archived" | "suspended";
export type BookingRequestStatus =
  | "pending"
  | "accepted"
  | "refused"
  | "countered"
  | "cancelled"
  | "expired"
  | "waitlisted";
export type ReviewType = "listing_review" | "traveler_review";
export type ReviewStatus = "pending" | "published" | "rejected" | "hidden";
export type SubscriptionStatus =
  | "trialing"
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "unpaid";
export type VerificationStatus = "unverified" | "pending" | "verified" | "rejected";

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          role: UserRole;
          display_name: string | null;
          avatar_url: string | null;
          phone: string | null;
          bio: string | null;
          locale: string;
          email_verified: boolean;
          phone_verified: boolean;
          identity_verification_status: VerificationStatus;
          identity_document_path: string | null;
          selfie_path: string | null;
          stripe_customer_id: string | null;
          referral_code: string;
          referred_by: string | null;
          is_suspended: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["profiles"]["Row"]> & {
          id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profiles"]["Row"]>;
        Relationships: [];
      };
      countries: {
        Row: { id: string; code: string; name: string; slug: string };
        Insert: Partial<Database["public"]["Tables"]["countries"]["Row"]> & {
          code: string;
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["countries"]["Row"]>;
        Relationships: [];
      };
      cities: {
        Row: {
          id: string;
          country_id: string;
          name: string;
          slug: string;
          latitude: number | null;
          longitude: number | null;
        };
        Insert: Partial<Database["public"]["Tables"]["cities"]["Row"]> & {
          country_id: string;
          name: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["cities"]["Row"]>;
        Relationships: [];
      };
      categories: {
        Row: { id: string; code: string; name: string; icon: string | null };
        Insert: Partial<Database["public"]["Tables"]["categories"]["Row"]> & {
          code: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["categories"]["Row"]>;
        Relationships: [];
      };
      amenities: {
        Row: { id: string; code: string; name: string; icon: string | null };
        Insert: Partial<Database["public"]["Tables"]["amenities"]["Row"]> & {
          code: string;
          name: string;
        };
        Update: Partial<Database["public"]["Tables"]["amenities"]["Row"]>;
        Relationships: [];
      };
      listings: {
        Row: {
          id: string;
          owner_id: string;
          type: ListingType;
          category_id: string | null;
          title: string;
          slug: string;
          description: string | null;
          country_id: string | null;
          city_id: string | null;
          address: string | null;
          latitude: number | null;
          longitude: number | null;
          max_guests: number;
          bedrooms: number;
          beds: number;
          bathrooms: number;
          base_price_per_night: number;
          currency: string;
          status: ListingStatus;
          view_count: number;
          favorite_count: number;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["listings"]["Row"]> & {
          owner_id: string;
          type: ListingType;
          title: string;
          slug: string;
        };
        Update: Partial<Database["public"]["Tables"]["listings"]["Row"]>;
        Relationships: [];
      };
      listing_photos: {
        Row: {
          id: string;
          listing_id: string;
          storage_path: string;
          position: number;
          is_cover: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["listing_photos"]["Row"]> & {
          listing_id: string;
          storage_path: string;
        };
        Update: Partial<Database["public"]["Tables"]["listing_photos"]["Row"]>;
        Relationships: [];
      };
      listing_videos: {
        Row: {
          id: string;
          listing_id: string;
          storage_path: string | null;
          url: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["listing_videos"]["Row"]> & {
          listing_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["listing_videos"]["Row"]>;
        Relationships: [];
      };
      listing_amenities: {
        Row: { listing_id: string; amenity_id: string };
        Insert: Database["public"]["Tables"]["listing_amenities"]["Row"];
        Update: Partial<Database["public"]["Tables"]["listing_amenities"]["Row"]>;
        Relationships: [];
      };
      listing_availability: {
        Row: {
          id: string;
          listing_id: string;
          date: string;
          is_available: boolean;
          price_override: number | null;
          source: string;
          external_uid: string | null;
        };
        Insert: Partial<Database["public"]["Tables"]["listing_availability"]["Row"]> & {
          listing_id: string;
          date: string;
        };
        Update: Partial<Database["public"]["Tables"]["listing_availability"]["Row"]>;
        Relationships: [];
      };
      subscription_plans: {
        Row: {
          id: string;
          code: ListingType;
          label: string;
          stripe_product_id: string | null;
          stripe_price_id: string | null;
          amount_cents: number;
          currency: string;
          trial_days: number;
          active: boolean;
        };
        Insert: Partial<Database["public"]["Tables"]["subscription_plans"]["Row"]> & {
          code: ListingType;
          label: string;
          amount_cents: number;
        };
        Update: Partial<Database["public"]["Tables"]["subscription_plans"]["Row"]>;
        Relationships: [];
      };
      subscriptions: {
        Row: {
          id: string;
          owner_id: string;
          listing_id: string | null;
          plan_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string;
          status: SubscriptionStatus;
          trial_start: string | null;
          trial_end: string | null;
          current_period_start: string | null;
          current_period_end: string | null;
          cancel_at_period_end: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]> & {
          owner_id: string;
          plan_id: string;
          stripe_customer_id: string;
          stripe_subscription_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["subscriptions"]["Row"]>;
        Relationships: [];
      };
      stripe_webhook_events: {
        Row: {
          id: string;
          stripe_event_id: string;
          type: string;
          payload: Json;
          processed_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["stripe_webhook_events"]["Row"]> & {
          stripe_event_id: string;
          type: string;
          payload: Json;
        };
        Update: Partial<Database["public"]["Tables"]["stripe_webhook_events"]["Row"]>;
        Relationships: [];
      };
      booking_requests: {
        Row: {
          id: string;
          listing_id: string;
          traveler_id: string;
          start_date: string;
          end_date: string;
          guests_count: number;
          message: string | null;
          proposed_price: number | null;
          counter_price: number | null;
          status: BookingRequestStatus;
          owner_response_message: string | null;
          responded_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["booking_requests"]["Row"]> & {
          listing_id: string;
          traveler_id: string;
          start_date: string;
          end_date: string;
        };
        Update: Partial<Database["public"]["Tables"]["booking_requests"]["Row"]>;
        Relationships: [];
      };
      reviews: {
        Row: {
          id: string;
          type: ReviewType;
          booking_request_id: string;
          reviewer_id: string;
          listing_id: string | null;
          reviewee_id: string | null;
          ratings: Json;
          rating_overall: number;
          comment: string | null;
          status: ReviewStatus;
          published_at: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["reviews"]["Row"]> & {
          type: ReviewType;
          booking_request_id: string;
          reviewer_id: string;
          rating_overall: number;
        };
        Update: Partial<Database["public"]["Tables"]["reviews"]["Row"]>;
        Relationships: [];
      };
      review_photos: {
        Row: { id: string; review_id: string; storage_path: string; position: number };
        Insert: Partial<Database["public"]["Tables"]["review_photos"]["Row"]> & {
          review_id: string;
          storage_path: string;
        };
        Update: Partial<Database["public"]["Tables"]["review_photos"]["Row"]>;
        Relationships: [];
      };
      favorites: {
        Row: { traveler_id: string; listing_id: string; created_at: string };
        Insert: Partial<Database["public"]["Tables"]["favorites"]["Row"]> & {
          traveler_id: string;
          listing_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["favorites"]["Row"]>;
        Relationships: [];
      };
      conversations: {
        Row: {
          id: string;
          listing_id: string | null;
          traveler_id: string;
          owner_id: string;
          last_message_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["conversations"]["Row"]> & {
          traveler_id: string;
          owner_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["conversations"]["Row"]>;
        Relationships: [];
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender_id: string;
          body: string;
          is_read: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["messages"]["Row"]> & {
          conversation_id: string;
          sender_id: string;
          body: string;
        };
        Update: Partial<Database["public"]["Tables"]["messages"]["Row"]>;
        Relationships: [];
      };
      notification_preferences: {
        Row: { profile_id: string; preferences: Json };
        Insert: Partial<Database["public"]["Tables"]["notification_preferences"]["Row"]> & {
          profile_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["notification_preferences"]["Row"]>;
        Relationships: [];
      };
      notifications: {
        Row: {
          id: string;
          profile_id: string;
          type: string;
          title: string;
          body: string | null;
          data: Json;
          is_read: boolean;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["notifications"]["Row"]> & {
          profile_id: string;
          type: string;
          title: string;
        };
        Update: Partial<Database["public"]["Tables"]["notifications"]["Row"]>;
        Relationships: [];
      };
      badges: {
        Row: { id: string; code: string; name: string; icon: string | null; scope: string };
        Insert: Partial<Database["public"]["Tables"]["badges"]["Row"]> & {
          code: string;
          name: string;
          scope: string;
        };
        Update: Partial<Database["public"]["Tables"]["badges"]["Row"]>;
        Relationships: [];
      };
      profile_badges: {
        Row: { profile_id: string; badge_id: string; awarded_at: string };
        Insert: Partial<Database["public"]["Tables"]["profile_badges"]["Row"]> & {
          profile_id: string;
          badge_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["profile_badges"]["Row"]>;
        Relationships: [];
      };
      listing_badges: {
        Row: { listing_id: string; badge_id: string; awarded_at: string };
        Insert: Partial<Database["public"]["Tables"]["listing_badges"]["Row"]> & {
          listing_id: string;
          badge_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["listing_badges"]["Row"]>;
        Relationships: [];
      };
      referrals: {
        Row: {
          id: string;
          referrer_id: string;
          referee_id: string;
          status: string;
          reward_granted_at: string | null;
          created_at: string;
        };
        Insert: Partial<Database["public"]["Tables"]["referrals"]["Row"]> & {
          referrer_id: string;
          referee_id: string;
        };
        Update: Partial<Database["public"]["Tables"]["referrals"]["Row"]>;
        Relationships: [];
      };
    };
    Views: {
      public_profiles: {
        Row: {
          id: string;
          display_name: string | null;
          avatar_url: string | null;
          bio: string | null;
          identity_verification_status: VerificationStatus;
          created_at: string;
        };
        Relationships: [];
      };
    };
    Functions: {
      current_user_role: { Args: Record<string, never>; Returns: UserRole };
    };
    Enums: {
      user_role: UserRole;
      listing_type: ListingType;
      listing_status: ListingStatus;
      booking_request_status: BookingRequestStatus;
      review_type: ReviewType;
      review_status: ReviewStatus;
      subscription_status: SubscriptionStatus;
      verification_status: VerificationStatus;
    };
  };
};
