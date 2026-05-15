import { notFound } from "next/navigation";
import { ClipboardList, Phone, Wallet } from "lucide-react";

import Avatar from "@mui/material/Avatar";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Grid from "@mui/material/Grid2";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { KpiCard } from "@/components/crm/kpi-card";
import { ModulePage } from "@/components/crm/module-page";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_TONES,
  type ClientStatus,
} from "@/lib/constants";
import { getClient, listClients } from "@/lib/data/clients";
import { PRIMARY_CONTAINER_TINT } from "@/lib/theme";
import { listOrdersForClient } from "@/lib/data/orders";
import { formatUah } from "@/lib/format";

import { OrdersTable } from "../../orders/_components/orders-table";

export const dynamic = "force-dynamic";

type Params = { id: string };

export default async function ClientDetailPage({
  params,
}: {
  params: Promise<Params>;
}) {
  const { id } = await params;

  const [client, stats, orders] = await Promise.all([
    getClient(id),
    listClients(),
    listOrdersForClient(id, 100),
  ]);

  if (!client) {
    notFound();
  }

  const clientStats = stats.find((c) => c.id === id);
  const status = client.status as ClientStatus;
  const ordersCount = clientStats?.orders_count ?? orders.length;
  const turnover = clientStats?.turnover_uah ?? 0;

  return (
    <ModulePage
      eyebrow={`Клієнт · ${client.code}`}
      title={client.name}
      description={
        client.contact_person
          ? `Контактна особа: ${client.contact_person}`
          : "Картка замовника та історія замовлень."
      }
      actions={
        <StatusBadge
          label={CLIENT_STATUS_LABELS[status]}
          tone={CLIENT_STATUS_TONES[status]}
        />
      }
    >
      {/* KPI grid */}
      <Grid container spacing={2}>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard
            label="Замовлень"
            value={String(ordersCount)}
            icon={ClipboardList}
            tone="info"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          <KpiCard
            label="Оборот"
            value={formatUah(turnover)}
            icon={Wallet}
            tone="success"
          />
        </Grid>
        <Grid size={{ xs: 12, sm: 6, md: 4 }}>
          {/* Contacts card — multi-line value, so custom Card instead of KpiCard */}
          <Card sx={{ height: "100%" }}>
            <CardContent>
              <Stack
                direction="row"
                justifyContent="space-between"
                alignItems="flex-start"
                spacing={2}
              >
                <Stack spacing={0.5} sx={{ minWidth: 0 }}>
                  <Typography variant="overline" color="text.secondary">
                    Контакти
                  </Typography>
                  <Typography variant="body2" fontWeight={500}>
                    {client.phone ?? "—"}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {client.email ?? "—"}
                  </Typography>
                </Stack>
                <Avatar
                  variant="rounded"
                  sx={{
                    bgcolor: PRIMARY_CONTAINER_TINT,
                    color: "primary.main",
                    width: 44,
                    height: 44,
                    borderRadius: 1.5,
                    flexShrink: 0,
                  }}
                >
                  <Phone size={20} />
                </Avatar>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Orders history */}
      <Stack spacing={1.5}>
        <Typography variant="h6" component="h2">
          Історія замовлень
        </Typography>
        <OrdersTable rows={orders} />
      </Stack>

      {/* Notes */}
      {client.notes && (
        <Card>
          <CardContent>
            <Typography variant="h6" component="h2" gutterBottom>
              Примітки
            </Typography>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ whiteSpace: "pre-wrap" }}
            >
              {client.notes}
            </Typography>
          </CardContent>
        </Card>
      )}
    </ModulePage>
  );
}
