"use client";

import { BookOpen, Pencil } from "lucide-react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataGrid,
  type GridColDef,
  type GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import { deleteVehicleAction } from "@/actions/vehicles";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { LinkBehavior } from "@/components/crm/link-behavior";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  VEHICLE_STATUS_LABELS,
  VEHICLE_STATUS_TONES,
  type VehicleStatus,
} from "@/lib/constants";
import type { VehicleWithStats } from "@/lib/data/vehicles";
import { formatDate, formatLiters, formatNumber } from "@/lib/format";

type VehiclesTableProps = {
  rows: VehicleWithStats[];
};

export function VehiclesTable({ rows }: VehiclesTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

  const columnVisibilityModel: GridColumnVisibilityModel = {
    plate: !isMobile,
    driver_full_name: !isMobile,
    fuel_norm_l_100km: !isMobile,
    service_next_date: !isMobile,
    service_next_odometer: !isMobile,
    notes: !isMobile,
    status: !isPhone,
  };

  const columns: GridColDef<VehicleWithStats>[] = [
    {
      field: "unit",
      headerName: "Авто",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Stack spacing={0.25}>
          <Typography variant="body2" fontWeight={500} color="text.primary">
            {row.unit}
          </Typography>
          {isMobile && (
            <Stack spacing={0} sx={{ mt: 0.25 }}>
              {row.plate && (
                <Typography
                  variant="caption"
                  color="text.secondary"
                  sx={{ fontFamily: "monospace" }}
                >
                  {row.plate}
                </Typography>
              )}
              {row.driver_full_name && (
                <Typography variant="caption" color="text.secondary">
                  {row.driver_full_name}
                </Typography>
              )}
            </Stack>
          )}
        </Stack>
      ),
    },
    {
      field: "plate",
      headerName: "Держномер",
      width: 130,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          sx={{ fontFamily: "monospace", color: "text.secondary" }}
        >
          {value ?? "—"}
        </Typography>
      ),
    },
    {
      field: "driver_full_name",
      headerName: "Водій",
      width: 180,
      renderCell: ({ value }) => (
        <Typography variant="body2" color={value ? "text.primary" : "text.secondary"}>
          {value ?? "Не закріплено"}
        </Typography>
      ),
    },
    {
      field: "fuel_norm_l_100km",
      headerName: "Розхід",
      width: 110,
      type: "number",
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {value != null ? formatLiters(value, true) : "—"}
        </Typography>
      ),
    },
    {
      field: "service_next_date",
      headerName: "Наступне ТО",
      width: 140,
      renderCell: ({ value }) => (
        <Typography variant="body2" color="text.secondary">
          {value ? formatDate(value) : "—"}
        </Typography>
      ),
    },
    {
      field: "service_next_odometer",
      headerName: "ТО на пробігу",
      width: 130,
      type: "number",
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <Typography variant="body2" color="text.secondary" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {value != null ? `${formatNumber(value)} км` : "—"}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Статус",
      width: 130,
      sortable: false,
      renderCell: ({ value }) => {
        const status = value as VehicleStatus | null;
        if (!status) return null;
        return (
          <StatusBadge
            label={VEHICLE_STATUS_LABELS[status]}
            tone={VEHICLE_STATUS_TONES[status]}
          />
        );
      },
    },
    {
      field: "notes",
      headerName: "Примітки",
      flex: 1,
      minWidth: 160,
      sortable: false,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          color="text.secondary"
          title={value ?? undefined}
          sx={{ overflow: "hidden", textOverflow: "ellipsis" }}
        >
          {value ?? "—"}
        </Typography>
      ),
    },
    {
      field: "actions",
      headerName: "Дії",
      width: 120,
      sortable: false,
      filterable: false,
      align: "right",
      headerAlign: "right",
      renderCell: ({ row }) => (
        <Stack direction="row" justifyContent="flex-end" alignItems="center">
          {row.id && (
            <IconButton
              component={LinkBehavior}
              href={`/vehicles/${row.id}/service-book`}
              aria-label="Сервісна книга"
            >
              <BookOpen size={18} />
            </IconButton>
          )}
          {row.id && (
            <IconButton
              component={LinkBehavior}
              href={`/vehicles/${row.id}/edit`}
              aria-label="Редагувати"
            >
              <Pencil size={18} />
            </IconButton>
          )}
          <ConfirmDeleteDialog
            title="Видалити авто?"
            description={`Авто ${row.plate} буде видалено. Якщо за ним закріплені замовлення — посилання знімуться.`}
            action={deleteVehicleAction}
            id={row.id!}
          />
        </Stack>
      ),
    },
  ];

  if (rows.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              Авто у автопарку немає
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Додайте перше авто з марками, держномером і нормативом розходу.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent sx={{ p: 0 }}>
        <Box sx={{ width: "100%" }}>
          <DataGrid
            rows={rows}
            columns={columns}
            getRowId={(row) => row.id ?? row.plate ?? ""}
            columnVisibilityModel={columnVisibilityModel}
            disableRowSelectionOnClick
            autoHeight
            pageSizeOptions={[10, 25, 50]}
            initialState={{
              pagination: {
                paginationModel: { pageSize: 25 },
              },
            }}
          />
        </Box>
      </CardContent>
    </Card>
  );
}
