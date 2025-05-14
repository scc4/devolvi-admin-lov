export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      address: {
        Row: {
          city: string | null
          complement: string | null
          created_at: string
          deleted_at: string | null
          district: string | null
          id: string
          latitude: number | null
          longitude: number | null
          number: string | null
          state: string | null
          street: string | null
          updated_at: string | null
          zip_code: string | null
        }
        Insert: {
          city?: string | null
          complement?: string | null
          created_at?: string
          deleted_at?: string | null
          district?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          number?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Update: {
          city?: string | null
          complement?: string | null
          created_at?: string
          deleted_at?: string | null
          district?: string | null
          id?: string
          latitude?: number | null
          longitude?: number | null
          number?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string | null
          zip_code?: string | null
        }
        Relationships: []
      }
      carrier_served_cities: {
        Row: {
          carrier_id: string
          city: string
          created_at: string
          id: string
          state: string
        }
        Insert: {
          carrier_id: string
          city: string
          created_at?: string
          id?: string
          state: string
        }
        Update: {
          carrier_id?: string
          city?: string
          created_at?: string
          id?: string
          state?: string
        }
        Relationships: [
          {
            foreignKeyName: "carrier_served_cities_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
        ]
      }
      carriers: {
        Row: {
          city: string
          created_at: string
          email: string | null
          id: string
          is_active: boolean
          manager: string
          name: string
          phone: string | null
          updated_at: string
        }
        Insert: {
          city: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          manager: string
          name: string
          phone?: string | null
          updated_at?: string
        }
        Update: {
          city?: string
          created_at?: string
          email?: string | null
          id?: string
          is_active?: boolean
          manager?: string
          name?: string
          phone?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      collection_points: {
        Row: {
          address: string
          address_id: string | null
          carrier_id: string | null
          created_at: string
          deleted_at: string | null
          establishment_id: string | null
          id: string
          is_active: boolean | null
          name: string
          operating_hours: Json | null
          phone: string | null
          updated_at: string
        }
        Insert: {
          address: string
          address_id?: string | null
          carrier_id?: string | null
          created_at?: string
          deleted_at?: string | null
          establishment_id?: string | null
          id?: string
          is_active?: boolean | null
          name: string
          operating_hours?: Json | null
          phone?: string | null
          updated_at?: string
        }
        Update: {
          address?: string
          address_id?: string | null
          carrier_id?: string | null
          created_at?: string
          deleted_at?: string | null
          establishment_id?: string | null
          id?: string
          is_active?: boolean | null
          name?: string
          operating_hours?: Json | null
          phone?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "collection_points_address_id_fkey"
            columns: ["address_id"]
            isOneToOne: false
            referencedRelation: "address"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_points_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "collection_points_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_carrier"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
        ]
      }
      devolutions: {
        Row: {
          authorization_code: string | null
          collection_point_id: string | null
          content: string | null
          created_at: string | null
          date_status: string | null
          deleted_at: string | null
          description: string | null
          id: string
          status: string | null
          tracker: string | null
          updated_at: string | null
          user_id: string | null
        }
        Insert: {
          authorization_code?: string | null
          collection_point_id?: string | null
          content?: string | null
          created_at?: string | null
          date_status?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          tracker?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Update: {
          authorization_code?: string | null
          collection_point_id?: string | null
          content?: string | null
          created_at?: string | null
          date_status?: string | null
          deleted_at?: string | null
          description?: string | null
          id?: string
          status?: string | null
          tracker?: string | null
          updated_at?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devolution_collection_point_id_fkey"
            columns: ["collection_point_id"]
            isOneToOne: false
            referencedRelation: "collection_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "devolution_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      devolutions_life_cycle: {
        Row: {
          created_at: string | null
          date_hour: string | null
          deleted_at: string | null
          devolution_id: string | null
          id: string
          phase: string | null
          stage: string | null
          tracker: string | null
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          date_hour?: string | null
          deleted_at?: string | null
          devolution_id?: string | null
          id?: string
          phase?: string | null
          stage?: string | null
          tracker?: string | null
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          date_hour?: string | null
          deleted_at?: string | null
          devolution_id?: string | null
          id?: string
          phase?: string | null
          stage?: string | null
          tracker?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "devolution_life_cycle_devolution_id_fkey"
            columns: ["devolution_id"]
            isOneToOne: false
            referencedRelation: "devolutions"
            referencedColumns: ["id"]
          },
        ]
      }
      establishment_managers: {
        Row: {
          created_at: string
          establishment_id: string
          id: string
          user_id: string
        }
        Insert: {
          created_at?: string
          establishment_id: string
          id?: string
          user_id: string
        }
        Update: {
          created_at?: string
          establishment_id?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "establishment_managers_establishment_id_fkey"
            columns: ["establishment_id"]
            isOneToOne: false
            referencedRelation: "establishments"
            referencedColumns: ["id"]
          },
        ]
      }
      establishments: {
        Row: {
          carrier_id: string | null
          created_at: string
          id: string
          name: string
          type: string
          updated_at: string
        }
        Insert: {
          carrier_id?: string | null
          created_at?: string
          id?: string
          name: string
          type: string
          updated_at?: string
        }
        Update: {
          carrier_id?: string | null
          created_at?: string
          id?: string
          name?: string
          type?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "establishments_carrier_id_fkey"
            columns: ["carrier_id"]
            isOneToOne: false
            referencedRelation: "carriers"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string | null
          deleted_at: string | null
          id: string
          read: boolean
          text: string
          type: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          read?: boolean
          text: string
          type: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          deleted_at?: string | null
          id?: string
          read?: boolean
          text?: string
          type?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      phone_temporary_codes: {
        Row: {
          code: number
          email: string
          expires_at: string
          id: string
          phone: string
        }
        Insert: {
          code: number
          email: string
          expires_at: string
          id?: string
          phone: string
        }
        Update: {
          code?: number
          email?: string
          expires_at?: string
          id?: string
          phone?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          id: string
          name: string | null
          phone: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          id: string
          name?: string | null
          phone?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          id?: string
          name?: string | null
          phone?: string | null
        }
        Relationships: []
      }
      user_collection_points: {
        Row: {
          collection_point_id: string
          current_collection_point: boolean
          deleted_at: string | null
          user_id: string
        }
        Insert: {
          collection_point_id: string
          current_collection_point?: boolean
          deleted_at?: string | null
          user_id: string
        }
        Update: {
          collection_point_id?: string
          current_collection_point?: boolean
          deleted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_collection_points_collection_point_id_fkey"
            columns: ["collection_point_id"]
            isOneToOne: false
            referencedRelation: "collection_points"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_collection_points_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_email_confirmations: {
        Row: {
          confirmed: boolean
          email: string
        }
        Insert: {
          confirmed?: boolean
          email: string
        }
        Update: {
          confirmed?: boolean
          email?: string
        }
        Relationships: []
      }
      user_permissions: {
        Row: {
          notices: boolean
          reminders: boolean
          updates: boolean
          user_id: string
        }
        Insert: {
          notices?: boolean
          reminders?: boolean
          updates?: boolean
          user_id?: string
        }
        Update: {
          notices?: boolean
          reminders?: boolean
          updates?: boolean
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_permissions_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_roles: {
        Row: {
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
      user_sessions: {
        Row: {
          expires_at: string | null
          id: string
          user_id: string
        }
        Insert: {
          expires_at?: string | null
          id?: string
          user_id: string
        }
        Update: {
          expires_at?: string | null
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_session_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      user_temporary_codes: {
        Row: {
          code: number
          expires_at: string
          id: string
          user_id: string
        }
        Insert: {
          code: number
          expires_at: string
          id?: string
          user_id: string
        }
        Update: {
          code?: number
          expires_at?: string
          id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_temporary_code_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          deleted_at: string | null
          email: string | null
          facebook_id: string | null
          google_id: string | null
          id: string
          name: string | null
          password: string | null
          phone: string | null
          updated_at: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          facebook_id?: string | null
          google_id?: string | null
          id?: string
          name?: string | null
          password?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          deleted_at?: string | null
          email?: string | null
          facebook_id?: string | null
          google_id?: string | null
          id?: string
          name?: string | null
          password?: string | null
          phone?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      has_role: {
        Args: {
          _user_id: string
          _role: Database["public"]["Enums"]["app_role"]
        }
        Returns: boolean
      }
      is_admin_or_owner: {
        Args: { user_id: string }
        Returns: boolean
      }
    }
    Enums: {
      app_role: "owner" | "admin" | "carrier" | "dropoff" | "user"
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {
      app_role: ["owner", "admin", "carrier", "dropoff", "user"],
    },
  },
} as const
