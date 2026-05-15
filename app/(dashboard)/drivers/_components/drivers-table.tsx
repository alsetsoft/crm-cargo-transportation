"use client";

import { History, Pencil } from "lucide-react";

import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import Link from "@mui/material/Link";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";
import useMediaQuery from "@mui/material/useMediaQuery";
import {
  DataGrid,
  type GridColDef,
  type GridColumnVisibilityModel,
} from "@mui/x-data-grid";

import { deleteDriverAction } from "@/actions/drivers";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { LinkBehavior } from "@/components/crm/link-behavior";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  DRIVER_STATUS_LABELS,
  DRIVER_STATUS_TONES,
  type DriverStatus,
} from "@/lib/constants";
import type { DriverWithStats } from "@/lib/data/drivers";
import { formatNumber, formatUahPrecise } from "@/lib/format";

type DriversTableProps = {
  rows: DriverWithStats[];
};

export function DriversTable({ rows }: DriversTableProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const isPhone = useMediaQuery(theme.breakpoints.down("sm"));

  const columnVisibilityModel: GridColumnVisibilityModel = {
    phone: !isMobile,
    vehicle_unit: !isMobile,
    vehicle_plate: !isMobile,
    orders_count: !isMobile,
    rating: !isMobile,
    commission_per_km_uah: !isMobile,
    notes: !isMobile,
    status: !isPhone,
  };

  const columns: GridColDef<DriverWithStats>[] = [
    {
      field: "full_name",
      headerName: "ПІБ",
      flex: 1,
      minWidth: 160,
      renderCell: ({ row }) => (
        <Stack spacing={0.25} sx={{ py: 0.5 }}>
          <Link
            component={LinkBehavior}
            href={`/drivers/${row.id}`}
            underline="hover"
            variant="body2"
            fontWeight={500}
            color="text.primary"
          >
            {row.full_name}
          </Link>
          {isPhone && row.phone && (
            <Typography variant="caption" color="text.secondary">
              {row.phone}
            </Typography>
          )}
          {isPhone && row.vehicle_plate && (
            <Typography
              variant="caption"
              color="text.secondary"
              sx={{ fontFamily: "monospace" }}
            >
              {row.vehicle_plate}
            </Typography>
          )}
        </Stack>
      ),
    },
    {
      field: "phone",
      headerName: "Телефон",
      width: 140,
      renderCell: ({ value }) => (
        <Typography variant="body2" color="text.secondary">
          {value ?? "—"}
        </Typography>
      ),
    },
    {
      field: "vehicle_unit",
      headerName: "Авто",
      width: 160,
      renderCell: ({ value }) => (
        <Typography variant="body2">
          {value ?? (
            <Typography component="span" variant="body2" color="text.secondary">
              Не закріплено
            </Typography>
          )}
        </Typography>
      ),
    },
    {
      field: "vehicle_plate",
      headerName: "Номер",
      width: 120,
      renderCell: ({ value }) => (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ fontFamily: "monospace" }}
        >
          {value ?? "—"}
        </Typography>
      ),
    },
    {
      field: "orders_count",
      headerName: "Рейсів",
      width: 90,
      type: "number",
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {formatNumber(value)}
        </Typography>
      ),
    },
    {
      field: "rating",
      headerName: "Рейтинг",
      width: 100,
      type: "number",
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {value != null ? formatNumber(value, 1) : "—"}
        </Typography>
      ),
    },
    {
      field: "commission_per_km_uah",
      headerName: "Комісія, ₴/км",
      width: 140,
      type: "number",
      align: "right",
      headerAlign: "right",
      renderCell: ({ value }) => (
        <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
          {value != null ? formatUahPrecise(value) : "—"}
        </Typography>
      ),
    },
    {
      field: "status",
      headerName: "Статус",
      width: 140,
      sortable: false,
      renderCell: ({ value }) => {
        const status = value as DriverStatus | null;
        if (!status) return null;
        return (
          <StatusBadge
            label={DRIVER_STATUS_LABELS[status]}
            tone={DRIVER_STATUS_TONES[status]}
          />
        );
      },
    },
    {
      field: "notes",
      headerName: "Примітки",
      flex: 1,
      minWidth: 140,
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
          {!isMobile && row.id && (
            <IconButton
              component={LinkBehavior}
              href={`/drivers/${row.id}`}
              aria-label="Історія поїздок"
            >
              <History size={18} />
            </IconButton>
          )}
          {row.id && (
            <IconButton
              component={LinkBehavior}
              href={`/drivers/${row.id}/edit`}
              aria-label="Редагувати"
            >
              <Pencil size={18} />
            </IconButton>
          )}
          <ConfirmDeleteDialog
            title="Видалити водія?"
            description={`Водія «${row.full_name}» буде видалено. Замовлення з ним перейдуть у статус без водія.`}
            action={deleteDriverAction}
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
              Водіїв ще немає
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Додайте першого водія, щоб призначати на рейси.
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
            getRowId={(row) => row.id ?? row.full_name ?? ""}
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
  );
}
