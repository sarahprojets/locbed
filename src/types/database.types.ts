export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          extensions?: Json
          operationName?: string
          query?: string
          variables?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      amenities: {
        Row: {
          code: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      badges: {
        Row: {
          code: string
          icon: string | null
          id: string
          name: string
          scope: string
        }
        Insert: {
          code: string
          icon?: string | null
          id?: string
          name: string
          scope: string
        }
        Update: {
          code?: string
          icon?: string | null
          id?: string
          name?: string
          scope?: string
        }
        Relationships: []
      }
      booking_requests: {
        Row: {
          counter_price: number | null
          created_at: string
          end_date: string
          guests_count: number
          id: string
          listing_id: string
          message: string | null
          owner_response_message: string | null
          proposed_price: number | null
          responded_at: string | null
          start_date: string
          status: Database["public"]["Enums"]["booking_request_status"]
          traveler_id: string
          updated_at: string
        }
        Insert: {
          counter_price?: number | null
          created_at?: string
          end_date: string
          guests_count?: number
          id?: string
          listing_id: string
          message?: string | null
          owner_response_message?: string | null
          proposed_price?: number | null
          responded_at?: string | null
          start_date: string
          status?: Database["public"]["Enums"]["booking_request_status"]
          traveler_id: string
          updated_at?: string
        }
        Update: {
          counter_price?: number | null
          created_at?: string
          end_date?: string
          guests_count?: number
          id?: string
          listing_id?: string
          message?: string | null
          owner_response_message?: string | null
          proposed_price?: number | null
          responded_at?: string | null
          start_date?: string
          status?: Database["public"]["Enums"]["booking_request_status"]
          traveler_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "booking_requests_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_requests_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "booking_requests_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      categories: {
        Row: {
          code: string
          icon: string | null
          id: string
          name: string
        }
        Insert: {
          code: string
          icon?: string | null
          id?: string
          name: string
        }
        Update: {
          code?: string
          icon?: string | null
          id?: string
          name?: string
        }
        Relationships: []
      }
      cities: {
        Row: {
          country_id: string
          id: string
          latitude: number | null
          longitude: number | null
          name: string
          slug: string
        }
        Insert: {
          country_id: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name: string
          slug: string
        }
        Update: {
          country_id?: string
          id?: string
          latitude?: number | null
          longitude?: number | null
          name?: string
          slug?: string
        }
        Relationships: [
          {
            foreignKeyName: "cities_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
        ]
      }
      conversations: {
        Row: {
          created_at: string
          id: string
          last_message_at: string | null
          listing_id: string | null
          owner_id: string
          traveler_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          listing_id?: string | null
          owner_id: string
          traveler_id: string
        }
        Update: {
          created_at?: string
          id?: string
          last_message_at?: string | null
          listing_id?: string | null
          owner_id?: string
          traveler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "conversations_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "conversations_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      countries: {
        Row: {
          code: string
          id: string
          name: string
          slug: string
        }
        Insert: {
          code: string
          id?: string
          name: string
          slug: string
        }
        Update: {
          code?: string
          id?: string
          name?: string
          slug?: string
        }
        Relationships: []
      }
      favorites: {
        Row: {
          created_at: string
          listing_id: string
          traveler_id: string
        }
        Insert: {
          created_at?: string
          listing_id: string
          traveler_id: string
        }
        Update: {
          created_at?: string
          listing_id?: string
          traveler_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "favorites_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "favorites_traveler_id_fkey"
            columns: ["traveler_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_amenities: {
        Row: {
          amenity_id: string
          listing_id: string
        }
        Insert: {
          amenity_id: string
          listing_id: string
        }
        Update: {
          amenity_id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_amenities_amenity_id_fkey"
            columns: ["amenity_id"]
            isOneToOne: false
            referencedRelation: "amenities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_amenities_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_availability: {
        Row: {
          date: string
          external_uid: string | null
          id: string
          is_available: boolean
          listing_id: string
          price_override: number | null
          source: string
        }
        Insert: {
          date: string
          external_uid?: string | null
          id?: string
          is_available?: boolean
          listing_id: string
          price_override?: number | null
          source?: string
        }
        Update: {
          date?: string
          external_uid?: string | null
          id?: string
          is_available?: boolean
          listing_id?: string
          price_override?: number | null
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_availability_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          listing_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          listing_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          listing_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listing_badges_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_photos: {
        Row: {
          created_at: string
          id: string
          is_cover: boolean
          listing_id: string
          position: number
          storage_path: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_cover?: boolean
          listing_id: string
          position?: number
          storage_path: string
        }
        Update: {
          created_at?: string
          id?: string
          is_cover?: boolean
          listing_id?: string
          position?: number
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "listing_photos_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listing_videos: {
        Row: {
          created_at: string
          id: string
          listing_id: string
          storage_path: string | null
          url: string | null
        }
        Insert: {
          created_at?: string
          id?: string
          listing_id: string
          storage_path?: string | null
          url?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          listing_id?: string
          storage_path?: string | null
          url?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "listing_videos_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
        ]
      }
      listings: {
        Row: {
          address: string | null
          base_price_per_night: number
          bathrooms: number
          bedrooms: number
          beds: number
          category_id: string | null
          city_id: string | null
          country_id: string | null
          created_at: string
          currency: string
          description: string | null
          favorite_count: number
          geog: unknown
          id: string
          latitude: number | null
          longitude: number | null
          max_guests: number
          owner_id: string
          published_at: string | null
          slug: string
          status: Database["public"]["Enums"]["listing_status"]
          title: string
          type: Database["public"]["Enums"]["listing_type"]
          updated_at: string
          view_count: number
        }
        Insert: {
          address?: string | null
          base_price_per_night?: number
          bathrooms?: number
          bedrooms?: number
          beds?: number
          category_id?: string | null
          city_id?: string | null
          country_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          favorite_count?: number
          geog?: unknown
          id?: string
          latitude?: number | null
          longitude?: number | null
          max_guests?: number
          owner_id: string
          published_at?: string | null
          slug: string
          status?: Database["public"]["Enums"]["listing_status"]
          title: string
          type: Database["public"]["Enums"]["listing_type"]
          updated_at?: string
          view_count?: number
        }
        Update: {
          address?: string | null
          base_price_per_night?: number
          bathrooms?: number
          bedrooms?: number
          beds?: number
          category_id?: string | null
          city_id?: string | null
          country_id?: string | null
          created_at?: string
          currency?: string
          description?: string | null
          favorite_count?: number
          geog?: unknown
          id?: string
          latitude?: number | null
          longitude?: number | null
          max_guests?: number
          owner_id?: string
          published_at?: string | null
          slug?: string
          status?: Database["public"]["Enums"]["listing_status"]
          title?: string
          type?: Database["public"]["Enums"]["listing_type"]
          updated_at?: string
          view_count?: number
        }
        Relationships: [
          {
            foreignKeyName: "listings_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_city_id_fkey"
            columns: ["city_id"]
            isOneToOne: false
            referencedRelation: "cities"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_country_id_fkey"
            columns: ["country_id"]
            isOneToOne: false
            referencedRelation: "countries"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "listings_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      messages: {
        Row: {
          body: string
          conversation_id: string
          created_at: string
          id: string
          is_read: boolean
          sender_id: string
        }
        Insert: {
          body: string
          conversation_id: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id: string
        }
        Update: {
          body?: string
          conversation_id?: string
          created_at?: string
          id?: string
          is_read?: boolean
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "messages_conversation_id_fkey"
            columns: ["conversation_id"]
            isOneToOne: false
            referencedRelation: "conversations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "messages_sender_id_fkey"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notification_preferences: {
        Row: {
          preferences: Json
          profile_id: string
        }
        Insert: {
          preferences?: Json
          profile_id: string
        }
        Update: {
          preferences?: Json
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notification_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notification_preferences_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          body: string | null
          created_at: string
          data: Json
          id: string
          is_read: boolean
          profile_id: string
          title: string
          type: string
        }
        Insert: {
          body?: string | null
          created_at?: string
          data?: Json
          id?: string
          is_read?: boolean
          profile_id: string
          title: string
          type: string
        }
        Update: {
          body?: string | null
          created_at?: string
          data?: Json
          id?: string
          is_read?: boolean
          profile_id?: string
          title?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profile_badges: {
        Row: {
          awarded_at: string
          badge_id: string
          profile_id: string
        }
        Insert: {
          awarded_at?: string
          badge_id: string
          profile_id: string
        }
        Update: {
          awarded_at?: string
          badge_id?: string
          profile_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "profile_badges_badge_id_fkey"
            columns: ["badge_id"]
            isOneToOne: false
            referencedRelation: "badges"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_badges_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profile_badges_profile_id_fkey"
            columns: ["profile_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string
          display_name: string | null
          email_verified: boolean
          id: string
          identity_document_path: string | null
          identity_verification_status: Database["public"]["Enums"]["verification_status"]
          is_suspended: boolean
          locale: string
          phone: string | null
          phone_verified: boolean
          referral_code: string
          referred_by: string | null
          role: Database["public"]["Enums"]["user_role"]
          selfie_path: string | null
          stripe_customer_id: string | null
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email_verified?: boolean
          id: string
          identity_document_path?: string | null
          identity_verification_status?: Database["public"]["Enums"]["verification_status"]
          is_suspended?: boolean
          locale?: string
          phone?: string | null
          phone_verified?: boolean
          referral_code?: string
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          selfie_path?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string
          display_name?: string | null
          email_verified?: boolean
          id?: string
          identity_document_path?: string | null
          identity_verification_status?: Database["public"]["Enums"]["verification_status"]
          is_suspended?: boolean
          locale?: string
          phone?: string | null
          phone_verified?: boolean
          referral_code?: string
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          selfie_path?: string | null
          stripe_customer_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "profiles_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      referrals: {
        Row: {
          created_at: string
          id: string
          referee_id: string
          referrer_id: string
          reward_granted_at: string | null
          status: string
        }
        Insert: {
          created_at?: string
          id?: string
          referee_id: string
          referrer_id: string
          reward_granted_at?: string | null
          status?: string
        }
        Update: {
          created_at?: string
          id?: string
          referee_id?: string
          referrer_id?: string
          reward_granted_at?: string | null
          status?: string
        }
        Relationships: [
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: true
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referee_id_fkey"
            columns: ["referee_id"]
            isOneToOne: true
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "referrals_referrer_id_fkey"
            columns: ["referrer_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      review_photos: {
        Row: {
          id: string
          position: number
          review_id: string
          storage_path: string
        }
        Insert: {
          id?: string
          position?: number
          review_id: string
          storage_path: string
        }
        Update: {
          id?: string
          position?: number
          review_id?: string
          storage_path?: string
        }
        Relationships: [
          {
            foreignKeyName: "review_photos_review_id_fkey"
            columns: ["review_id"]
            isOneToOne: false
            referencedRelation: "reviews"
            referencedColumns: ["id"]
          },
        ]
      }
      reviews: {
        Row: {
          booking_request_id: string
          comment: string | null
          created_at: string
          id: string
          listing_id: string | null
          published_at: string | null
          rating_overall: number
          ratings: Json
          reviewee_id: string | null
          reviewer_id: string
          status: Database["public"]["Enums"]["review_status"]
          type: Database["public"]["Enums"]["review_type"]
          updated_at: string
        }
        Insert: {
          booking_request_id: string
          comment?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          published_at?: string | null
          rating_overall: number
          ratings?: Json
          reviewee_id?: string | null
          reviewer_id: string
          status?: Database["public"]["Enums"]["review_status"]
          type: Database["public"]["Enums"]["review_type"]
          updated_at?: string
        }
        Update: {
          booking_request_id?: string
          comment?: string | null
          created_at?: string
          id?: string
          listing_id?: string | null
          published_at?: string | null
          rating_overall?: number
          ratings?: Json
          reviewee_id?: string | null
          reviewer_id?: string
          status?: Database["public"]["Enums"]["review_status"]
          type?: Database["public"]["Enums"]["review_type"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reviews_booking_request_id_fkey"
            columns: ["booking_request_id"]
            isOneToOne: false
            referencedRelation: "booking_requests"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewee_id_fkey"
            columns: ["reviewee_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reviews_reviewer_id_fkey"
            columns: ["reviewer_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      stripe_webhook_events: {
        Row: {
          id: string
          payload: Json
          processed_at: string
          stripe_event_id: string
          type: string
        }
        Insert: {
          id?: string
          payload: Json
          processed_at?: string
          stripe_event_id: string
          type: string
        }
        Update: {
          id?: string
          payload?: Json
          processed_at?: string
          stripe_event_id?: string
          type?: string
        }
        Relationships: []
      }
      subscription_plans: {
        Row: {
          active: boolean
          amount_cents: number
          code: Database["public"]["Enums"]["listing_type"]
          currency: string
          id: string
          label: string
          stripe_price_id: string | null
          stripe_product_id: string | null
          trial_days: number
        }
        Insert: {
          active?: boolean
          amount_cents: number
          code: Database["public"]["Enums"]["listing_type"]
          currency?: string
          id?: string
          label: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          trial_days?: number
        }
        Update: {
          active?: boolean
          amount_cents?: number
          code?: Database["public"]["Enums"]["listing_type"]
          currency?: string
          id?: string
          label?: string
          stripe_price_id?: string | null
          stripe_product_id?: string | null
          trial_days?: number
        }
        Relationships: []
      }
      subscriptions: {
        Row: {
          cancel_at_period_end: boolean
          created_at: string
          current_period_end: string | null
          current_period_start: string | null
          id: string
          listing_id: string | null
          owner_id: string
          plan_id: string
          status: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end: string | null
          trial_start: string | null
          updated_at: string
        }
        Insert: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          listing_id?: string | null
          owner_id: string
          plan_id: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id: string
          stripe_subscription_id: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
        }
        Update: {
          cancel_at_period_end?: boolean
          created_at?: string
          current_period_end?: string | null
          current_period_start?: string | null
          id?: string
          listing_id?: string | null
          owner_id?: string
          plan_id?: string
          status?: Database["public"]["Enums"]["subscription_status"]
          stripe_customer_id?: string
          stripe_subscription_id?: string
          trial_end?: string | null
          trial_start?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "subscriptions_listing_id_fkey"
            columns: ["listing_id"]
            isOneToOne: false
            referencedRelation: "listings"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_owner_id_fkey"
            columns: ["owner_id"]
            isOneToOne: false
            referencedRelation: "public_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "subscriptions_plan_id_fkey"
            columns: ["plan_id"]
            isOneToOne: false
            referencedRelation: "subscription_plans"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      public_profiles: {
        Row: {
          avatar_url: string | null
          bio: string | null
          created_at: string | null
          display_name: string | null
          id: string | null
          identity_verification_status:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Insert: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          identity_verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Update: {
          avatar_url?: string | null
          bio?: string | null
          created_at?: string | null
          display_name?: string | null
          id?: string | null
          identity_verification_status?:
            | Database["public"]["Enums"]["verification_status"]
            | null
        }
        Relationships: []
      }
    }
    Functions: {
      current_user_role: {
        Args: never
        Returns: Database["public"]["Enums"]["user_role"]
      }
      custom_access_token_hook: { Args: { event: Json }; Returns: Json }
    }
    Enums: {
      booking_request_status:
        | "pending"
        | "accepted"
        | "refused"
        | "countered"
        | "cancelled"
        | "expired"
        | "waitlisted"
      listing_status: "draft" | "published" | "archived" | "suspended"
      listing_type: "appartement" | "maison"
      review_status: "pending" | "published" | "rejected" | "hidden"
      review_type: "listing_review" | "traveler_review"
      subscription_status:
        | "trialing"
        | "active"
        | "past_due"
        | "canceled"
        | "incomplete"
        | "unpaid"
      user_role: "voyageur" | "proprietaire" | "admin"
      verification_status: "unverified" | "pending" | "verified" | "rejected"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  storage: {
    Tables: {
      buckets: {
        Row: {
          allowed_mime_types: string[] | null
          avif_autodetection: boolean | null
          created_at: string | null
          file_size_limit: number | null
          id: string
          name: string
          owner: string | null
          owner_id: string | null
          public: boolean | null
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string | null
        }
        Insert: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id: string
          name: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Update: {
          allowed_mime_types?: string[] | null
          avif_autodetection?: boolean | null
          created_at?: string | null
          file_size_limit?: number | null
          id?: string
          name?: string
          owner?: string | null
          owner_id?: string | null
          public?: boolean | null
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string | null
        }
        Relationships: []
      }
      buckets_analytics: {
        Row: {
          created_at: string
          deleted_at: string | null
          format: string
          id: string
          name: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          deleted_at?: string | null
          format?: string
          id?: string
          name?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      buckets_vectors: {
        Row: {
          created_at: string
          id: string
          type: Database["storage"]["Enums"]["buckettype"]
          updated_at: string
        }
        Insert: {
          created_at?: string
          id: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Update: {
          created_at?: string
          id?: string
          type?: Database["storage"]["Enums"]["buckettype"]
          updated_at?: string
        }
        Relationships: []
      }
      migrations: {
        Row: {
          executed_at: string | null
          hash: string
          id: number
          name: string
        }
        Insert: {
          executed_at?: string | null
          hash: string
          id: number
          name: string
        }
        Update: {
          executed_at?: string | null
          hash?: string
          id?: number
          name?: string
        }
        Relationships: []
      }
      objects: {
        Row: {
          bucket_id: string | null
          created_at: string | null
          id: string
          last_accessed_at: string | null
          metadata: Json | null
          name: string | null
          owner: string | null
          owner_id: string | null
          path_tokens: string[] | null
          updated_at: string | null
          user_metadata: Json | null
          version: string | null
        }
        Insert: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Update: {
          bucket_id?: string | null
          created_at?: string | null
          id?: string
          last_accessed_at?: string | null
          metadata?: Json | null
          name?: string | null
          owner?: string | null
          owner_id?: string | null
          path_tokens?: string[] | null
          updated_at?: string | null
          user_metadata?: Json | null
          version?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "objects_bucketId_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads: {
        Row: {
          bucket_id: string
          created_at: string
          id: string
          in_progress_size: number
          key: string
          metadata: Json | null
          owner_id: string | null
          upload_signature: string
          user_metadata: Json | null
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          id: string
          in_progress_size?: number
          key: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature: string
          user_metadata?: Json | null
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          id?: string
          in_progress_size?: number
          key?: string
          metadata?: Json | null
          owner_id?: string | null
          upload_signature?: string
          user_metadata?: Json | null
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
        ]
      }
      s3_multipart_uploads_parts: {
        Row: {
          bucket_id: string
          created_at: string
          etag: string
          id: string
          key: string
          owner_id: string | null
          part_number: number
          size: number
          upload_id: string
          version: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          etag: string
          id?: string
          key: string
          owner_id?: string | null
          part_number: number
          size?: number
          upload_id: string
          version: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          etag?: string
          id?: string
          key?: string
          owner_id?: string | null
          part_number?: number
          size?: number
          upload_id?: string
          version?: string
        }
        Relationships: [
          {
            foreignKeyName: "s3_multipart_uploads_parts_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "s3_multipart_uploads_parts_upload_id_fkey"
            columns: ["upload_id"]
            isOneToOne: false
            referencedRelation: "s3_multipart_uploads"
            referencedColumns: ["id"]
          },
        ]
      }
      vector_indexes: {
        Row: {
          bucket_id: string
          created_at: string
          data_type: string
          dimension: number
          distance_metric: string
          id: string
          metadata_configuration: Json | null
          name: string
          updated_at: string
        }
        Insert: {
          bucket_id: string
          created_at?: string
          data_type: string
          dimension: number
          distance_metric: string
          id?: string
          metadata_configuration?: Json | null
          name: string
          updated_at?: string
        }
        Update: {
          bucket_id?: string
          created_at?: string
          data_type?: string
          dimension?: number
          distance_metric?: string
          id?: string
          metadata_configuration?: Json | null
          name?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vector_indexes_bucket_id_fkey"
            columns: ["bucket_id"]
            isOneToOne: false
            referencedRelation: "buckets_vectors"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      allow_any_operation: {
        Args: { expected_operations: string[] }
        Returns: boolean
      }
      allow_only_operation: {
        Args: { expected_operation: string }
        Returns: boolean
      }
      can_insert_object: {
        Args: { bucketid: string; metadata: Json; name: string; owner: string }
        Returns: undefined
      }
      extension: { Args: { name: string }; Returns: string }
      filename: { Args: { name: string }; Returns: string }
      foldername: { Args: { name: string }; Returns: string[] }
      get_common_prefix: {
        Args: { p_delimiter: string; p_key: string; p_prefix: string }
        Returns: string
      }
      get_size_by_bucket: {
        Args: never
        Returns: {
          bucket_id: string
          size: number
        }[]
      }
      list_multipart_uploads_with_delimiter: {
        Args: {
          bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_key_token?: string
          next_upload_token?: string
          prefix_param: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
        }[]
      }
      list_objects_with_delimiter: {
        Args: {
          _bucket_id: string
          delimiter_param: string
          max_keys?: number
          next_token?: string
          prefix_param: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      operation: { Args: never; Returns: string }
      search: {
        Args: {
          bucketname: string
          levels?: number
          limits?: number
          offsets?: number
          prefix: string
          search?: string
          sortcolumn?: string
          sortorder?: string
        }
        Returns: {
          created_at: string
          id: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_by_timestamp: {
        Args: {
          p_bucket_id: string
          p_level: number
          p_limit: number
          p_prefix: string
          p_sort_column: string
          p_sort_column_after: string
          p_sort_order: string
          p_start_after: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
      search_v2: {
        Args: {
          bucket_name: string
          levels?: number
          limits?: number
          prefix: string
          sort_column?: string
          sort_column_after?: string
          sort_order?: string
          start_after?: string
        }
        Returns: {
          created_at: string
          id: string
          key: string
          last_accessed_at: string
          metadata: Json
          name: string
          updated_at: string
        }[]
      }
    }
    Enums: {
      buckettype: "STANDARD" | "ANALYTICS" | "VECTOR"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {
      booking_request_status: [
        "pending",
        "accepted",
        "refused",
        "countered",
        "cancelled",
        "expired",
        "waitlisted",
      ],
      listing_status: ["draft", "published", "archived", "suspended"],
      listing_type: ["appartement", "maison"],
      review_status: ["pending", "published", "rejected", "hidden"],
      review_type: ["listing_review", "traveler_review"],
      subscription_status: [
        "trialing",
        "active",
        "past_due",
        "canceled",
        "incomplete",
        "unpaid",
      ],
      user_role: ["voyageur", "proprietaire", "admin"],
      verification_status: ["unverified", "pending", "verified", "rejected"],
    },
  },
  storage: {
    Enums: {
      buckettype: ["STANDARD", "ANALYTICS", "VECTOR"],
    },
  },
} as const

// Convenience aliases used throughout the app instead of the verbose
// Database["public"]["Enums"]["..."] path.
export type UserRole = Database["public"]["Enums"]["user_role"]
export type ListingType = Database["public"]["Enums"]["listing_type"]
export type ListingStatus = Database["public"]["Enums"]["listing_status"]
export type BookingRequestStatus = Database["public"]["Enums"]["booking_request_status"]
export type ReviewType = Database["public"]["Enums"]["review_type"]
export type ReviewStatus = Database["public"]["Enums"]["review_status"]
export type SubscriptionStatus = Database["public"]["Enums"]["subscription_status"]
export type VerificationStatus = Database["public"]["Enums"]["verification_status"]
