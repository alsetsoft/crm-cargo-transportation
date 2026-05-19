"use client";

import Alert from "@mui/material/Alert";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataGrid,
  type GridColDef,
  type GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import { StatusBadge } from "@/components/crm/status-badge";
import {
  GPS_STATUS_LABELS,
  GPS_STATUS_TONES,
  type GpsStatus,
} from "@/lib/constants";
import type { GpsRow } from "@/lib/data/gps";
import { formatCoords, formatDateTime, formatSpeed } from "@/lib/format";

type GpsTableProps = {
  rows: GpsRow[];
  configured: boolean;
};

export function GpsTable({ rows, configured }: GpsTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

  const columnVisibilityModel: GridColumnVisibilityModel = {
    plate: !isMobile,
    driver_full_name: !isMobile,
    location: !isPhone,
    last_fix_at: !isMobile,
  };

  const columns: GridColDef<GpsRow>[] = [
    {
      field: "unit",
      headerName: "Авто",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Stack spacing={0.25}>
          <Typography variant="body2" fontWeight={500} color="text.primary">
            {row.unit || "—"}
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
      headerName: "Номер",
      width: 130,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          sx={{ fontFamily: "monospace", color: "text.secondary" }}
        >
          {value || "—"}
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
      field: "location",
      headerName: "Поточне місце",
      flex: 1,
      minWidth: 200,
      sortable: false,
      renderCell: ({ row }) => {
        if (row.lat == null || row.lng == null) {
          return (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          );
        }
        const href = `https://www.google.com/maps?q=${row.lat},${row.lng}`;
        return (
          <Typography
            component="a"
            href={href}
            target="_blank"
            rel="noreferrer"
            variant="body2"
            sx={{
              fontFamily: "monospace",
              color: "primary.main",
              textDecoration: "none",
              "&:hover": { textDecoration: "underline" },
            }}
          >
            {formatCoords(row.lat, row.lng)}
          </Typography>
        );
      },
    },
    {
      field: "speed_kmh",
      headerName: "Швидкість",
      width: 110,
      type: "number",
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {formatSpeed(value as number | null | undefined)}
        </Typography>
      ),
    },
    {
      field: "last_fix_at",
      headerName: "Останній сигнал",
      width: 170,
      renderCell: ({ value }) => (
        <Typography variant="body2" color="text.secondary">
          {formatDateTime(value as string | null | undefined)}
        </Typography>
      ),
    },
    {
      field: "gps_status",
      headerName: "Статус",
      width: 140,
      sortable: false,
      renderCell: ({ value }) => {
        const status = value as GpsStatus;
        if (status === "unlinked") {
          return (
            <Typography variant="body2" color="text.secondary">
              —
            </Typography>
          );
        }
        return (
          <StatusBadge label={GPS_STATUS_LABELS[status]} tone={GPS_STATUS_TONES[status]} />
        );
      },
    },
  ];

  if (rows.length === 0) {
    return (
      <Stack spacing={2}>
        {!configured && (
          <Alert severity="info" variant="outlined">
            Інтеграцію DozoR не налаштовано. Зверніться до адміністратора, щоб
            додати <code>DOZOR_API_BASE_URL</code> та <code>DOZOR_API_KEY</code>.
          </Alert>
        )}
        <Card variant="outlined">
          <CardContent>
            <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
              <Typography variant="subtitle1" fontWeight={500}>
                Авто у автопарку немає
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Додайте авто та зв&apos;яжіть його з трекером DozoR на сторінці редагування.
              </Typography>
            </Stack>
          </CardContent>
        </Card>
      </Stack>
    );
  }

  return (
    <Stack spacing={2}>
      {!configured && (
        <Alert severity="info" variant="outlined">
          Інтеграцію DozoR не налаштовано. Зверніться до адміністратора, щоб
          додати <code>DOZOR_API_BASE_URL</code> та <code>DOZOR_API_KEY</code>.
        </Alert>
      )}
      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ width: "100%" }}>
            <DataGrid
              rows={rows}
              columns={columns}
              getRowId={(row) => row.vehicle_id}
              columnVisibilityModel={columnVisibilityModel}
              disableRowSelectionOnClick
              autoHeight
              pageSizeOptions={[10, 25, 50]}
              initialState={{
                pagination: {
                  paginationModel: { pageSize: 25 },
                },
              }}
              sx={{ border: "none" }}
            />
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
