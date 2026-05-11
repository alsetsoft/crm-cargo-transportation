export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  __InternalSupabase: {
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      clients: {
        Row: {
          code: string
          contact_person: string | null
          created_at: string
          debt_uah: number
          edrpou: string | null
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
          debt_uah?: number
          edrpou?: string | null
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
          debt_uah?: number
          edrpou?: string | null
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
      orders: {
        Row: {
          actual_profit_uah: number | null
          client_id: string
          created_at: string
          driver_id: string | null
          fuel_cost_uah: number
          id: string
          km_invoice: number | null
          km_salary: number | null
          notes: string | null
          number: string
          odometer_end: number | null
          odometer_start: number | null
          payment_form: Database["public"]["Enums"]["payment_form"]
          payment_status: Database["public"]["Enums"]["payment_status"]
          price_uah: number
          profitability_pct: number | null
          refuels_count: number
          route_id: string | null
          status: Database["public"]["Enums"]["order_status"]
          updated_at: string
          vehicle_id: string | null
          volume_tons: number | null
        }
        Insert: {
          actual_profit_uah?: number | null
          client_id: string
          created_at?: string
          driver_id?: string | null
          fuel_cost_uah?: number
          id?: string
          km_invoice?: number | null
          km_salary?: number | null
          notes?: string | null
          number: string
          odometer_end?: number | null
          odometer_start?: number | null
          payment_form?: Database["public"]["Enums"]["payment_form"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          price_uah?: number
          profitability_pct?: number | null
          refuels_count?: number
          route_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
          updated_at?: string
          vehicle_id?: string | null
          volume_tons?: number | null
        }
        Update: {
          actual_profit_uah?: number | null
          client_id?: string
          created_at?: string
          driver_id?: string | null
          fuel_cost_uah?: number
          id?: string
          km_invoice?: number | null
          km_salary?: number | null
          notes?: string | null
          number?: string
          odometer_end?: number | null
          odometer_start?: number | null
          payment_form?: Database["public"]["Enums"]["payment_form"]
          payment_status?: Database["public"]["Enums"]["payment_status"]
          price_uah?: number
          profitability_pct?: number | null
          refuels_count?: number
          route_id?: string | null
          status?: Database["public"]["Enums"]["order_status"]
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
            foreignKeyName: "orders_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
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
      routes: {
        Row: {
          created_at: string
          distance_km: number
          id: string
          name: string
          notes: string | null
          point_a: string
          point_b: string
          status: Database["public"]["Enums"]["route_status"]
          typical_duration_hours: number | null
          updated_at: string
        }
        Insert: {
          created_at?: string
          distance_km: number
          id?: string
          name: string
          notes?: string | null
          point_a: string
          point_b: string
          status?: Database["public"]["Enums"]["route_status"]
          typical_duration_hours?: number | null
          updated_at?: string
        }
        Update: {
          created_at?: string
          distance_km?: number
          id?: string
          name?: string
          notes?: string | null
          point_a?: string
          point_b?: string
          status?: Database["public"]["Enums"]["route_status"]
          typical_duration_hours?: number | null
          updated_at?: string
        }
        Relationships: []
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
          debt_uah: number | null
          edrpou: string | null
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
          client_code: string | null
          client_id: string | null
          client_name: string | null
          created_at: string | null
          distance_actual_km: number | null
          driver_full_name: string | null
          driver_id: string | null
          fuel_cost_uah: number | null
          fuel_expected_liters: number | null
          fuel_norm_l_100km: number | null
          id: string | null
          km_invoice: number | null
          km_salary: number | null
          notes: string | null
          number: string | null
          odometer_end: number | null
          odometer_start: number | null
          payment_form: Database["public"]["Enums"]["payment_form"] | null
          payment_status: Database["public"]["Enums"]["payment_status"] | null
          price_uah: number | null
          profitability_pct: number | null
          refuels_count: number | null
          route_id: string | null
          route_name: string | null
          status: Database["public"]["Enums"]["order_status"] | null
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
            foreignKeyName: "orders_route_id_fkey"
            columns: ["route_id"]
            isOneToOne: false
            referencedRelation: "routes"
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
      show_limit: { Args: never; Returns: number }
      show_trgm: { Args: { "": string }; Returns: string[] }
    }
    Enums: {
      client_status: "active" | "inactive" | "awaiting_payment"
      driver_status: "on_trip" | "available" | "unavailable"
      order_status: "new" | "in_progress" | "completed" | "cancelled"
      payment_form: "cash" | "bank_transfer" | "card"
      payment_status: "unpaid" | "partial" | "paid"
      route_status: "active" | "archived"
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
