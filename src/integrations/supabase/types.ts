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
    PostgrestVersion: "14.4"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          application_id: string
          application_type: string
          date_submitted: string
          establishment_id: string | null
          status: string
          user_id: string
        }
        Insert: {
          application_id?: string
          application_type: string
          date_submitted?: string
          establishment_id?: string | null
          status?: string
          user_id: string
        }
        Update: {
          application_id?: string
          application_type?: string
          date_submitted?: string
          establishment_id?: string | null
          status?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "applications_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["establishment_id"]
          },
          {
            foreignKeyName: "applications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      certificates: {
        Row: {
          application_id: string | null
          certificate_id: string
          certificate_no: string
          expiry_date: string | null
          issue_date: string
          qr_code: string | null
        }
        Insert: {
          application_id?: string | null
          certificate_id?: string
          certificate_no: string
          expiry_date?: string | null
          issue_date?: string
          qr_code?: string | null
        }
        Update: {
          application_id?: string | null
          certificate_id?: string
          certificate_no?: string
          expiry_date?: string | null
          issue_date?: string
          qr_code?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "certificates_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      establishments: {
        Row: {
          address: string
          business_name: string
          business_type: string
          created_at: string
          establishment_id: string
          permit_status: string | null
          user_id: string
        }
        Insert: {
          address: string
          business_name: string
          business_type: string
          created_at?: string
          establishment_id?: string
          permit_status?: string | null
          user_id: string
        }
        Update: {
          address?: string
          business_name?: string
          business_type?: string
          created_at?: string
          establishment_id?: string
          permit_status?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "establishments_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      inspections: {
        Row: {
          application_id: string | null
          compliance_status: string | null
          findings: string | null
          inspection_date: string
          inspection_id: string
          inspector_id: string | null
        }
        Insert: {
          application_id?: string | null
          compliance_status?: string | null
          findings?: string | null
          inspection_date?: string
          inspection_id?: string
          inspector_id?: string | null
        }
        Update: {
          application_id?: string | null
          compliance_status?: string | null
          findings?: string | null
          inspection_date?: string
          inspection_id?: string
          inspector_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "inspections_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
          {
            foreignKeyName: "inspections_inspector_id_fkey"
            columns: ["inspector_id"]
            isOneToOne: false
            referencedRelation: "inspectors"
            referencedColumns: ["inspector_id"]
          },
        ]
      }
      inspectors: {
        Row: {
          department: string | null
          inspector_id: string
          name: string
          position: string | null
          status: string
        }
        Insert: {
          department?: string | null
          inspector_id?: string
          name: string
          position?: string | null
          status?: string
        }
        Update: {
          department?: string | null
          inspector_id?: string
          name?: string
          position?: string | null
          status?: string
        }
        Relationships: []
      }
      lab_results: {
        Row: {
          application_id: string | null
          date_uploaded: string
          lab_id: string
          result: string
          test_type: string
        }
        Insert: {
          application_id?: string | null
          date_uploaded?: string
          lab_id?: string
          result: string
          test_type: string
        }
        Update: {
          application_id?: string | null
          date_uploaded?: string
          lab_id?: string
          result?: string
          test_type?: string
        }
        Relationships: [
          {
            foreignKeyName: "lab_results_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      payments: {
        Row: {
          amount: number
          application_id: string | null
          created_at: string
          payment_id: string
          payment_method: string | null
          receipt_no: string | null
        }
        Insert: {
          amount: number
          application_id?: string | null
          created_at?: string
          payment_id?: string
          payment_method?: string | null
          receipt_no?: string | null
        }
        Update: {
          amount?: number
          application_id?: string | null
          created_at?: string
          payment_id?: string
          payment_method?: string | null
          receipt_no?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "payments_application_id_fkey"
            columns: ["application_id"]
            isOneToOne: false
            referencedRelation: "applications"
            referencedColumns: ["application_id"]
          },
        ]
      }
      users: {
        Row: {
          account_status: string
          address: string | null
          contact_no: string | null
          created_at: string
          email: string
          full_name: string
          user_id: string
          user_type: Database["public"]["Enums"]["user_type_enum"]
        }
        Insert: {
          account_status?: string
          address?: string | null
          contact_no?: string | null
          created_at?: string
          email: string
          full_name: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type_enum"]
        }
        Update: {
          account_status?: string
          address?: string | null
          contact_no?: string | null
          created_at?: string
          email?: string
          full_name?: string
          user_id?: string
          user_type?: Database["public"]["Enums"]["user_type_enum"]
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: { _user_id: string }; Returns: boolean }
      is_inspector_or_admin: { Args: { _user_id: string }; Returns: boolean }
    }
    Enums: {
      user_type_enum:
        | "citizen"
        | "business_owner"
        | "health_worker"
        | "inspector"
        | "admin"
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
  public: {
    Enums: {
      user_type_enum: [
        "citizen",
        "business_owner",
        "health_worker",
        "inspector",
        "admin",
      ],
    },
  },
} as const
