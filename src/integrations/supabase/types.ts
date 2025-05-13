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
          carrier_id: string | null
          city: string | null
          complement: string | null
          created_at: string
          deleted_at: string | null
          district: string | null
          establishment_id: string | null
          id: string
          is_active: boolean | null
          latitude: number | null
          longitude: number | null
          name: string
          number: string | null
          operating_hours: Json | null
          phone: string | null
          state: string | null
          street: string | null
          updated_at: string
          zip_code: string | null
        }
        Insert: {
          address: string
          carrier_id?: string | null
          city?: string | null
          complement?: string | null
          created_at?: string
          deleted_at?: string | null
          district?: string | null
          establishment_id?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name: string
          number?: string | null
          operating_hours?: Json | null
          phone?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Update: {
          address?: string
          carrier_id?: string | null
          city?: string | null
          complement?: string | null
          created_at?: string
          deleted_at?: string | null
          district?: string | null
          establishment_id?: string | null
          id?: string
          is_active?: boolean | null
          latitude?: number | null
          longitude?: number | null
          name?: string
          number?: string | null
          operating_hours?: Json | null
          phone?: string | null
          state?: string | null
          street?: string | null
          updated_at?: string
          zip_code?: string | null
        }
        Relationships: [
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
      devolution: {
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
            referencedRelation: "user"
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
      user: {
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
