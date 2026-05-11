import "server-only";

import { createClient } from "@/lib/supabase/server";

export type DashboardKpi = {
  activeOrders: number;
  vehiclesOnTrip: number;
  driversAvailable: number;
  monthlyRevenue: number;
};

export async function getDashboardKpi(): Promise<DashboardKpi> {
  const supabase = await createClient();

  const monthStart = new Date();
  monthStart.setDate(1);
  monthStart.setHours(0, 0, 0, 0);

  const [activeOrders, vehiclesOnTrip, driversAvailable, monthlyOrders] =
    await Promise.all([
      supabase
        .from("orders")
        .select("id", { count: "exact", head: true })
        .in("status", ["new", "in_progress"]),
      supabase
        .from("vehicles")
        .select("id", { count: "exact", head: true })
        .eq("status", "on_trip"),
      supabase
        .from("drivers")
        .select("id", { count: "exact", head: true })
        .eq("status", "available"),
      supabase
        .from("orders")
        .select("price_uah")
        .gte("created_at", monthStart.toISOString()),
    ]);

  const monthlyRevenue = (monthlyOrders.data ?? []).reduce(
    (sum, row) => sum + Number(row.price_uah ?? 0),
    0,
  );

  return {
    activeOrders: activeOrders.count ?? 0,
    vehiclesOnTrip: vehiclesOnTrip.count ?? 0,
    driversAvailable: driversAvailable.count ?? 0,
    monthlyRevenue,
  };
}
