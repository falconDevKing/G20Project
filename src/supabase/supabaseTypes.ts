export type Json = string | number | boolean | null | { [key: string]: Json | undefined } | Json[];

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)";
  };
  public: {
    Tables: {
      chapter: {
        Row: {
          base_currency: string | null;
          country: string | null;
          created_at: string | null;
          division_id: string | null;
          id: string;
          name: string;
          organisation_id: string | null;
          region_id: string | null;
          reps: Json | null;
          updated_at: string | null;
        };
        Insert: {
          base_currency?: string | null;
          country?: string | null;
          created_at?: string | null;
          division_id?: string | null;
          id?: string;
          name: string;
          organisation_id?: string | null;
          region_id?: string | null;
          reps?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          base_currency?: string | null;
          country?: string | null;
          created_at?: string | null;
          division_id?: string | null;
          id?: string;
          name?: string;
          organisation_id?: string | null;
          region_id?: string | null;
          reps?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "chapter_division_id_fkey";
            columns: ["division_id"];
            isOneToOne: false;
            referencedRelation: "division";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chapter_organisation_id_fkey";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisation";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "chapter_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "region";
            referencedColumns: ["id"];
          },
        ];
      };
      division: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          organisation_id: string | null;
          reps: Json | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          organisation_id?: string | null;
          reps?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          organisation_id?: string | null;
          reps?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "division_organisation_id_fkey";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisation";
            referencedColumns: ["id"];
          },
        ];
      };
      organisation: {
        Row: {
          created_at: string | null;
          id: string;
          name: string;
          reps: Json | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          id?: string;
          name: string;
          reps?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          id?: string;
          name?: string;
          reps?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [];
      };
      partner: {
        Row: {
          address: string | null;
          birth_day_mmdd: string | null;
          chapter_id: string | null;
          cognito_user_id: string | null;
          created_at: string | null;
          date_of_birth: string | null;
          division_id: string | null;
          email: string;
          first_name: string;
          gender: string | null;
          ggp_category: string;
          id: string;
          image_url: string | null;
          last_name: string;
          middle_name: string | null;
          name: string | null;
          name_code: string | null;
          nationality: string | null;
          occupation: string | null;
          organisation_id: string | null;
          partner_type: string | null;
          paystack_authorization_code: string | null;
          paystack_authorization_details: Json | null;
          paystack_customer_code: string | null;
          paystack_customer_id: string | null;
          paystack_monthly_payment: boolean | null;
          paystack_monthly_payment_id: string | null;
          permission_access: string[] | null;
          permission_type: string | null;
          phone_number: string | null;
          region_id: string | null;
          remission_start_date: string | null;
          status: string | null;
          stripe_customer_id: string | null;
          subscription_ids: Json | null;
          unique_code: string | null;
          updated_at: string | null;
          verified: boolean;
        };
        Insert: {
          address?: string | null;
          birth_day_mmdd?: string | null;
          chapter_id?: string | null;
          cognito_user_id?: string | null;
          created_at?: string | null;
          date_of_birth?: string | null;
          division_id?: string | null;
          email: string;
          first_name: string;
          gender?: string | null;
          ggp_category: string;
          id?: string;
          image_url?: string | null;
          last_name: string;
          middle_name?: string | null;
          name?: string | null;
          name_code?: string | null;
          nationality?: string | null;
          occupation?: string | null;
          organisation_id?: string | null;
          partner_type?: string | null;
          paystack_authorization_code?: string | null;
          paystack_authorization_details?: Json | null;
          paystack_customer_code?: string | null;
          paystack_customer_id?: string | null;
          paystack_monthly_payment?: boolean | null;
          paystack_monthly_payment_id?: string | null;
          permission_access?: string[] | null;
          permission_type?: string | null;
          phone_number?: string | null;
          region_id?: string | null;
          remission_start_date?: string | null;
          status?: string | null;
          stripe_customer_id?: string | null;
          subscription_ids?: Json | null;
          unique_code?: string | null;
          updated_at?: string | null;
          verified: boolean;
        };
        Update: {
          address?: string | null;
          birth_day_mmdd?: string | null;
          chapter_id?: string | null;
          cognito_user_id?: string | null;
          created_at?: string | null;
          date_of_birth?: string | null;
          division_id?: string | null;
          email?: string;
          first_name?: string;
          gender?: string | null;
          ggp_category?: string;
          id?: string;
          image_url?: string | null;
          last_name?: string;
          middle_name?: string | null;
          name?: string | null;
          name_code?: string | null;
          nationality?: string | null;
          occupation?: string | null;
          organisation_id?: string | null;
          partner_type?: string | null;
          paystack_authorization_code?: string | null;
          paystack_authorization_details?: Json | null;
          paystack_customer_code?: string | null;
          paystack_customer_id?: string | null;
          paystack_monthly_payment?: boolean | null;
          paystack_monthly_payment_id?: string | null;
          permission_access?: string[] | null;
          permission_type?: string | null;
          phone_number?: string | null;
          region_id?: string | null;
          remission_start_date?: string | null;
          status?: string | null;
          stripe_customer_id?: string | null;
          subscription_ids?: Json | null;
          unique_code?: string | null;
          updated_at?: string | null;
          verified?: boolean;
        };
        Relationships: [
          {
            foreignKeyName: "partner_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapter";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partner_division_id_fkey";
            columns: ["division_id"];
            isOneToOne: false;
            referencedRelation: "division";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partner_organisation_id_fkey";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisation";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "partner_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "region";
            referencedColumns: ["id"];
          },
        ];
      };
      payment: {
        Row: {
          amount: number | null;
          approved_by: string | null;
          approved_by_id: string | null;
          approved_by_image: string | null;
          chapter_id: string | null;
          conversion_amount: number | null;
          conversion_currency: string | null;
          conversion_description: string | null;
          conversion_rate: number | null;
          conversion_time: string | null;
          created_at: string | null;
          currency: string | null;
          description: string | null;
          division_id: string | null;
          gbp_equivalent: number | null;
          id: string;
          is_converted: boolean | null;
          organisation_id: string | null;
          payment_date: string | null;
          recurring_id: string | null;
          region_id: string | null;
          remission_month: string | null;
          remission_period: string | null;
          remission_year: string | null;
          status: string | null;
          unique_code: string | null;
          updated_at: string | null;
          user_id: string | null;
          user_name: string | null;
        };
        Insert: {
          amount?: number | null;
          approved_by?: string | null;
          approved_by_id?: string | null;
          approved_by_image?: string | null;
          chapter_id?: string | null;
          conversion_amount?: number | null;
          conversion_currency?: string | null;
          conversion_description?: string | null;
          conversion_rate?: number | null;
          conversion_time?: string | null;
          created_at?: string | null;
          currency?: string | null;
          description?: string | null;
          division_id?: string | null;
          gbp_equivalent?: number | null;
          id?: string;
          is_converted?: boolean | null;
          organisation_id?: string | null;
          payment_date?: string | null;
          recurring_id?: string | null;
          region_id?: string | null;
          remission_month?: string | null;
          remission_period?: string | null;
          remission_year?: string | null;
          status?: string | null;
          unique_code?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          user_name?: string | null;
        };
        Update: {
          amount?: number | null;
          approved_by?: string | null;
          approved_by_id?: string | null;
          approved_by_image?: string | null;
          chapter_id?: string | null;
          conversion_amount?: number | null;
          conversion_currency?: string | null;
          conversion_description?: string | null;
          conversion_rate?: number | null;
          conversion_time?: string | null;
          created_at?: string | null;
          currency?: string | null;
          description?: string | null;
          division_id?: string | null;
          gbp_equivalent?: number | null;
          id?: string;
          is_converted?: boolean | null;
          organisation_id?: string | null;
          payment_date?: string | null;
          recurring_id?: string | null;
          region_id?: string | null;
          remission_month?: string | null;
          remission_period?: string | null;
          remission_year?: string | null;
          status?: string | null;
          unique_code?: string | null;
          updated_at?: string | null;
          user_id?: string | null;
          user_name?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "payment_chapter_id_fkey";
            columns: ["chapter_id"];
            isOneToOne: false;
            referencedRelation: "chapter";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_division_id_fkey";
            columns: ["division_id"];
            isOneToOne: false;
            referencedRelation: "division";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_organisation_id_fkey";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisation";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_region_id_fkey";
            columns: ["region_id"];
            isOneToOne: false;
            referencedRelation: "region";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "payment_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "partner";
            referencedColumns: ["id"];
          },
        ];
      };
      paystack_recurring_payments: {
        Row: {
          active: boolean | null;
          amount: number | null;
          authorization_code: string;
          chapter_id: string | null;
          charge_day: number | null;
          created_at: string | null;
          currency: string | null;
          customer_code: string | null;
          email: string;
          frequency: string | null;
          id: string;
          updated_at: string | null;
          user_id: string | null;
        };
        Insert: {
          active?: boolean | null;
          amount?: number | null;
          authorization_code: string;
          chapter_id?: string | null;
          charge_day?: number | null;
          created_at?: string | null;
          currency?: string | null;
          customer_code?: string | null;
          email: string;
          frequency?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Update: {
          active?: boolean | null;
          amount?: number | null;
          authorization_code?: string;
          chapter_id?: string | null;
          charge_day?: number | null;
          created_at?: string | null;
          currency?: string | null;
          customer_code?: string | null;
          email?: string;
          frequency?: string | null;
          id?: string;
          updated_at?: string | null;
          user_id?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "recurring_payment_user_id_fkey";
            columns: ["user_id"];
            isOneToOne: false;
            referencedRelation: "partner";
            referencedColumns: ["id"];
          },
        ];
      };
      region: {
        Row: {
          created_at: string | null;
          division_id: string | null;
          id: string;
          name: string;
          organisation_id: string | null;
          reps: Json | null;
          updated_at: string | null;
        };
        Insert: {
          created_at?: string | null;
          division_id?: string | null;
          id?: string;
          name: string;
          organisation_id?: string | null;
          reps?: Json | null;
          updated_at?: string | null;
        };
        Update: {
          created_at?: string | null;
          division_id?: string | null;
          id?: string;
          name?: string;
          organisation_id?: string | null;
          reps?: Json | null;
          updated_at?: string | null;
        };
        Relationships: [
          {
            foreignKeyName: "region_division_id_fkey";
            columns: ["division_id"];
            isOneToOne: false;
            referencedRelation: "division";
            referencedColumns: ["id"];
          },
          {
            foreignKeyName: "region_organisation_id_fkey";
            columns: ["organisation_id"];
            isOneToOne: false;
            referencedRelation: "organisation";
            referencedColumns: ["id"];
          },
        ];
      };
    };
    Views: {
      [_ in never]: never;
    };
    Functions: {
      get_partner_metrics_filtered: {
        Args: { input_chapter_id?: string; input_division_id?: string };
        Returns: Json;
      };
      get_remission_metrics_filtered: {
        Args: { input_chapter_id?: string; input_division_id?: string };
        Returns: Json;
      };
    };
    Enums: {
      [_ in never]: never;
    };
    CompositeTypes: {
      [_ in never]: never;
    };
  };
};

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">;

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">];

export type Tables<
  DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"]) | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R;
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] & DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R;
      }
      ? R
      : never
    : never;

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I;
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I;
      }
      ? I
      : never
    : never;

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"] | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U;
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U;
      }
      ? U
      : never
    : never;

export type Enums<
  DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"] | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never;

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"] | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals;
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals;
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never;

export const Constants = {
  public: {
    Enums: {},
  },
} as const;
