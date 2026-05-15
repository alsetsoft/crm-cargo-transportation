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
  public: {
    Tables: {
      audit_logs: {
        Row: {
          action: string
          created_at: string
          description: string | null
          entity_id: string | null
          entity_label: string | null
          entity_type: string
          id: string
        }
        Insert: {
          action: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_label?: string | null
          entity_type: string
          id?: string
        }
        Update: {
          action?: string
          created_at?: string
          description?: string | null
          entity_id?: string | null
          entity_label?: string | null
          entity_type?: string
          id?: string
        }
        Relationships: []
      }
      clients: {
        Row: {
          code: string
          contact_person: string | null
          created_at: string
          email: string | null
          id: string
          name: string
          notes: string | null
          phone: string | null
          status: Database["public"]["Enums"]["client_status"]
          updated_at: string
        }
        Insert: {
          code: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Update: {
          code?: string
          contact_person?: string | null
          created_at?: string
          email?: string | null
          id?: string
          name?: string
          notes?: string | null
          phone?: string | null
          status?: Database["public"]["Enums"]["client_status"]
          updated_at?: string
        }
        Relationships: []
      }
      drivers: {
        Row: {
          commission_per_km_uah: number
          created_at: string
          current_vehicle_id: string | null
          full_name: string
          id: string
          notes: string | null
          phone: string | null
          rating: number | null
          status: Database["public"]["Enums"]["driver_status"]
          updated_at: string
        }
        Insert: {
          commission_per_km_uah?: number
          created_at?: string
          current_vehicle_id?: string | null
          full_name: string
          id?: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
        }
        Update: {
          commission_per_km_uah?: number
          created_at?: string
          current_vehicle_id?: string | null
          full_name?: string
          id?: string
          notes?: string | null
          phone?: string | null
          rating?: number | null
          status?: Database["public"]["Enums"]["driver_status"]
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "drivers_current_vehicle_id_fkey"
            columns: ["current_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_current_vehicle_id_fkey"
            columns: ["current_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      expenses: {
        Row: {
          amount_uah: number
          created_at: string
          id: string
          name: string
          notes: string | null
          order_id: string | null
          spent_at: string
        }
        Insert: {
          amount_uah: number
          created_at?: string
          id?: string
          name: string
          notes?: string | null
          order_id?: string | null
          spent_at?: string
        }
        Update: {
          amount_uah?: number
          created_at?: string
          id?: string
          name?: string
          notes?: string | null
          order_id?: string | null
          spent_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "expenses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "expenses_order_id_fkey"
            columns: ["order_id"]
            isOneToOne: false
            referencedRelation: "orders_with_metrics"
            referencedColumns: ["id"]
          },
        ]
      }
      orders: {
        Row: {
          arrived_at: string | null
          client_id: string
          created_at: string
          departed_at: string | null
          distance_km: number
          driver_commission_override_uah: number | null
          driver_id: string | null
          fuel_cost_uah: number
          id: string
          loading_place: string | null
          notes: string | null
          number: string
          odometer_end: number | null
          odometer_start: number | null
          payment_form: Database["public"]["Enums"]["payment_form"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          price_per_km_override_uah: number | null
          price_uah: number
          refuels_count: number
          status: Database["public"]["Enums"]["order_status"]
          unloading_place: string | null
          updated_at: string
          vehicle_id: string | null
          volume_tons: number | null
        }
        Insert: {
          arrived_at?: string | null
          client_id: string
          created_at?: string
          departed_at?: string | null
          distance_km: number
          driver_commission_override_uah?: number | null
          driver_id?: string | null
          fuel_cost_uah?: number
          id?: string
          loading_place?: string | null
          notes?: string | null
          number: string
          odometer_end?: number | null
          odometer_start?: number | null
          payment_form?: Database["public"]["Enums"]["payment_form"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          price_per_km_override_uah?: number | null
          price_uah?: number
          refuels_count?: number
          status?: Database["public"]["Enums"]["order_status"]
          unloading_place?: string | null
          updated_at?: string
          vehicle_id?: string | null
          volume_tons?: number | null
        }
        Update: {
          arrived_at?: string | null
          client_id?: string
          created_at?: string
          departed_at?: string | null
          distance_km?: number
          driver_commission_override_uah?: number | null
          driver_id?: string | null
          fuel_cost_uah?: number
          id?: string
          loading_place?: string | null
          notes?: string | null
          number?: string
          odometer_end?: number | null
          odometer_start?: number | null
          payment_form?: Database["public"]["Enums"]["payment_form"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          price_per_km_override_uah?: number | null
          price_uah?: number
          refuels_count?: number
          status?: Database["public"]["Enums"]["order_status"]
          unloading_place?: string | null
          updated_at?: string
          vehicle_id?: string | null
          volume_tons?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      profiles: {
        Row: {
          created_at: string
          email: string
          full_name: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          full_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          full_name?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      vehicle_service_procedures: {
        Row: {
          created_at: string
          id: string
          notes: string | null
          period_days: number | null
          period_km: number | null
          type: Database["public"]["Enums"]["vehicle_document_type"]
          updated_at: string
          vehicle_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          notes?: string | null
          period_days?: number | null
          period_km?: number | null
          type: Database["public"]["Enums"]["vehicle_document_type"]
          updated_at?: string
          vehicle_id: string
        }
        Update: {
          created_at?: string
          id?: string
          notes?: string | null
          period_days?: number | null
          period_km?: number | null
          type?: Database["public"]["Enums"]["vehicle_document_type"]
          updated_at?: string
          vehicle_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_service_procedures_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicle_service_procedures_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicle_service_records: {
        Row: {
          completed_at: string
          created_at: string
          id: string
          notes: string | null
          odometer: number | null
          procedure_id: string
        }
        Insert: {
          completed_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          odometer?: number | null
          procedure_id: string
        }
        Update: {
          completed_at?: string
          created_at?: string
          id?: string
          notes?: string | null
          odometer?: number | null
          procedure_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicle_service_records_procedure_id_fkey"
            columns: ["procedure_id"]
            isOneToOne: false
            referencedRelation: "vehicle_service_procedures"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles: {
        Row: {
          created_at: string
          current_driver_id: string | null
          fuel_norm_l_100km: number | null
          id: string
          notes: string | null
          plate: string
          service_next_date: string | null
          service_next_odometer: number | null
          status: Database["public"]["Enums"]["vehicle_status"]
          unit: string
          updated_at: string
        }
        Insert: {
          created_at?: string
          current_driver_id?: string | null
          fuel_norm_l_100km?: number | null
          id?: string
          notes?: string | null
          plate: string
          service_next_date?: string | null
          service_next_odometer?: number | null
          status?: Database["public"]["Enums"]["vehicle_status"]
          unit: string
          updated_at?: string
        }
        Update: {
          created_at?: string
          current_driver_id?: string | null
          fuel_norm_l_100km?: number | null
          id?: string
          notes?: string | null
          plate?: string
          service_next_date?: string | null
          service_next_odometer?: number | null
          status?: Database["public"]["Enums"]["vehicle_status"]
          unit?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_current_driver_fk"
            columns: ["current_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_current_driver_fk"
            columns: ["current_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      clients_with_stats: {
        Row: {
          code: string | null
          contact_person: string | null
          created_at: string | null
          email: string | null
          id: string | null
          name: string | null
          notes: string | null
          orders_count: number | null
          phone: string | null
          status: Database["public"]["Enums"]["client_status"] | null
          turnover_uah: number | null
          updated_at: string | null
        }
        Relationships: []
      }
      drivers_with_stats: {
        Row: {
          commission_per_km_uah: number | null
          created_at: string | null
          current_vehicle_id: string | null
          full_name: string | null
          id: string | null
          notes: string | null
          orders_count: number | null
          phone: string | null
          rating: number | null
          status: Database["public"]["Enums"]["driver_status"] | null
          updated_at: string | null
          vehicle_plate: string | null
          vehicle_unit: string | null
        }
        Relationships: [
          {
            foreignKeyName: "drivers_current_vehicle_id_fkey"
            columns: ["current_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "drivers_current_vehicle_id_fkey"
            columns: ["current_vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      orders_with_metrics: {
        Row: {
          actual_profit_uah: number | null
          arrived_at: string | null
          client_code: string | null
          client_id: string | null
          client_name: string | null
          created_at: string | null
          departed_at: string | null
          distance_km: number | null
          driver_commission_override_uah: number | null
          driver_commission_per_km_uah: number | null
          driver_commission_uah: number | null
          driver_full_name: string | null
          driver_id: string | null
          fuel_cost_uah: number | null
          fuel_norm_l_100km: number | null
          id: string | null
          loading_place: string | null
          notes: string | null
          number: string | null
          odometer_end: number | null
          odometer_start: number | null
          other_expenses_uah: number | null
          payment_form: Database["public"]["Enums"]["payment_form"] | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          price_per_km_override_uah: number | null
          price_per_km_uah: number | null
          price_uah: number | null
          profitability_pct: number | null
          refuels_count: number | null
          status: Database["public"]["Enums"]["order_status"] | null
          unloading_place: string | null
          updated_at: string | null
          vehicle_id: string | null
          vehicle_plate: string | null
          vehicle_unit: string | null
          volume_tons: number | null
        }
        Relationships: [
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_client_id_fkey"
            columns: ["client_id"]
            isOneToOne: false
            referencedRelation: "clients_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_driver_id_fkey"
            columns: ["driver_id"]
            isOneToOne: false
            referencedRelation: "drivers_with_stats"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "orders_vehicle_id_fkey"
            columns: ["vehicle_id"]
            isOneToOne: false
            referencedRelation: "vehicles_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
      vehicles_with_stats: {
        Row: {
          created_at: string | null
          current_driver_id: string | null
          driver_full_name: string | null
          fuel_norm_l_100km: number | null
          id: string | null
          notes: string | null
          plate: string | null
          service_next_date: string | null
          service_next_odometer: number | null
          status: Database["public"]["Enums"]["vehicle_status"] | null
          unit: string | null
          updated_at: string | null
        }
        Relationships: [
          {
            foreignKeyName: "vehicles_current_driver_fk"
            columns: ["current_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "vehicles_current_driver_fk"
            columns: ["current_driver_id"]
            isOneToOne: false
            referencedRelation: "drivers_with_stats"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      client_status: "active" | "inactive" | "awaiting_payment"
      driver_status: "on_trip" | "available" | "unavailable"
      order_status: "new" | "in_progress" | "completed" | "cancelled"
      payment_form: "cash" | "bank_transfer" | "card"
      payment_status: "unpaid" | "partial" | "paid"
      user_role: "admin"
      vehicle_document_type:
        | "service_book"
        | "insurance"
        | "technical_inspection"
        | "tachograph"
      vehicle_status: "on_trip" | "service" | "available"
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

export type Views<T extends keyof Database["public"]["Views"]> =
  Database["public"]["Views"][T]["Row"]

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
      client_status: ["active", "inactive", "awaiting_payment"],
      driver_status: ["on_trip", "available", "unavailable"],
      order_status: ["new", "in_progress", "completed", "cancelled"],
      payment_form: ["cash", "bank_transfer", "card"],
      payment_status: ["unpaid", "partial", "paid"],
      user_role: ["admin"],
      vehicle_document_type: [
        "service_book",
        "insurance",
        "technical_inspection",
        "tachograph",
      ],
      vehicle_status: ["on_trip", "service", "available"],
    },
  },
} as const
