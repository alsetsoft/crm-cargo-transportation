import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Chip from "@mui/material/Chip";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { VEHICLE_DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import type {
  ServiceProcedureStatus,
  ServiceProcedureView,
} from "@/lib/data/service-procedures";
import { formatDate, formatNumber } from "@/lib/format";

import { ServiceProcedureActions } from "./service-procedure-actions";

type ServiceBookTableProps = {
  rows: ServiceProcedureView[];
  vehicleCurrentOdometer: number;
};

const STATUS_LABELS: Record<ServiceProcedureStatus, string> = {
  ok: "В нормі",
  due_soon: "Скоро",
  overdue: "Прострочено",
  unknown: "Не виконувалось",
};

// Map service procedure status to MUI Chip color
const STATUS_MUI_COLORS: Record<
  ServiceProcedureStatus,
  "success" | "warning" | "error" | "default"
> = {
  ok: "success",
  due_soon: "warning",
  overdue: "error",
  unknown: "default",
};

function formatPeriod(km: number | null, days: number | null): string {
  const parts: string[] = [];
  if (km != null) parts.push(`${formatNumber(km)} км`);
  if (days != null) parts.push(`${formatNumber(days)} дн`);
  return parts.join(" / ") || "—";
}

function formatInsurancePeriod(
  startDate: string | null,
  endDate: string | null,
): string {
  if (!startDate && !endDate) return "—";
  if (startDate && endDate) return `${formatDate(startDate)} — ${formatDate(endDate)}`;
  if (endDate) return `до ${formatDate(endDate)}`;
  return `з ${formatDate(startDate)}`;
}

function formatRemaining(
  km: number | null,
  days: number | null,
  status: ServiceProcedureStatus,
): string {
  if (status === "unknown") return "—";
  const parts: string[] = [];
  if (km != null) parts.push(`${formatNumber(km)} км`);
  if (days != null) parts.push(`${formatNumber(days)} дн`);
  return parts.join(" / ") || "—";
}

function remainingColor(
  status: ServiceProcedureStatus,
): "error.main" | "warning.main" | "text.primary" {
  if (status === "overdue") return "error.main";
  if (status === "due_soon") return "warning.main";
  return "text.primary";
}

export function ServiceBookTable({
  rows,
  vehicleCurrentOdometer,
}: ServiceBookTableProps) {
  if (rows.length === 0) {
    return (
      <Card variant="outlined">
        <CardContent>
          <Stack alignItems="center" spacing={1.5} sx={{ py: 6 }}>
            <Typography variant="subtitle1" fontWeight={500}>
              Процедур ще немає
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Додайте першу процедуру обслуговування — наприклад, ТО кожні 10000 км.
            </Typography>
          </Stack>
        </CardContent>
      </Card>
    );
  }

  return (
    <Stack spacing={2}>
      {/* Current odometer banner */}
      <Card variant="outlined">
        <CardContent sx={{ py: 1.5, "&:last-child": { pb: 1.5 } }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="body2" color="text.secondary">
              Поточний пробіг авто
            </Typography>
            <Typography
              variant="body2"
              fontWeight={500}
              sx={{ fontVariantNumeric: "tabular-nums" }}
            >
              {vehicleCurrentOdometer > 0
                ? `${formatNumber(vehicleCurrentOdometer)} км`
                : "—"}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      {/* Procedures table */}
      <Card variant="outlined">
        <CardContent sx={{ p: 0 }}>
          <Box sx={{ overflowX: "auto" }}>
            <Box
              component="table"
              sx={{
                width: "100%",
                borderCollapse: "collapse",
                "& th": {
                  textAlign: "left",
                  px: 2,
                  py: 1.5,
                  typography: "caption",
                  fontWeight: 600,
                  color: "text.secondary",
                  borderBottom: 1,
                  borderColor: "divider",
                  whiteSpace: "nowrap",
                },
                "& td": {
                  px: 2,
                  py: 1.5,
                  borderBottom: 1,
                  borderColor: "divider",
                  // Match the implicit `<th>` vertical-align of `middle` so
                  // headers and their content share the same baseline — when
                  // the Procedure column expands to multiple lines, status
                  // chip + actions don't visually drift apart.
                  verticalAlign: "middle",
                  "&:last-child": {
                    textAlign: "right",
                  },
                },
                "& tr:last-child td": {
                  borderBottom: "none",
                },
              }}
            >
              <thead>
                <tr>
                  <Box component="th" scope="col">
                    Процедура
                  </Box>
                  <Box
                    component="th"
                    scope="col"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    Період
                  </Box>
                  <Box
                    component="th"
                    scope="col"
                    sx={{ display: { xs: "none", md: "table-cell" } }}
                  >
                    Останнє виконання
                  </Box>
                  <Box
                    component="th"
                    scope="col"
                    sx={{
                      display: { xs: "none", md: "table-cell" },
                      textAlign: "right",
                    }}
                  >
                    Пробіг
                  </Box>
                  <Box
                    component="th"
                    scope="col"
                    sx={{
                      display: { xs: "none", md: "table-cell" },
                      textAlign: "right",
                    }}
                  >
                    Залишок
                  </Box>
                  <Box component="th" scope="col">
                    Статус
                  </Box>
                  <Box component="th" scope="col" sx={{ textAlign: "right" }}>
                    Дії
                  </Box>
                </tr>
              </thead>
              <tbody>
                {rows.map((row) => (
                  <tr key={row.id}>
                    {/* Procedure name + mobile-compressed details */}
                    <Box component="td">
                      <Typography variant="body2" fontWeight={500}>
                        {VEHICLE_DOCUMENT_TYPE_LABELS[row.type]}
                      </Typography>
                      {row.notes && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          display="block"
                        >
                          {row.notes}
                        </Typography>
                      )}
                      <Box sx={{ display: { xs: "block", md: "none" }, mt: 0.5 }}>
                        <Typography variant="caption" color="text.secondary" display="block">
                          Період:{" "}
                          {row.type === "insurance"
                            ? formatInsurancePeriod(
                                row.insurance_start_date,
                                row.insurance_end_date,
                              )
                            : formatPeriod(row.period_km, row.period_days)}
                        </Typography>
                        {row.type !== "insurance" && row.last_completed_at && (
                          <Typography variant="caption" color="text.secondary" display="block">
                            Виконано: {formatDate(row.last_completed_at)}
                            {row.last_odometer != null
                              ? ` · ${formatNumber(row.last_odometer)} км`
                              : ""}
                          </Typography>
                        )}
                        <Typography
                          variant="caption"
                          display="block"
                          sx={{ color: remainingColor(row.status), fontWeight: row.status === "ok" ? 400 : 500 }}
                        >
                          Залишок:{" "}
                          {formatRemaining(row.remaining_km, row.remaining_days, row.status)}
                        </Typography>
                      </Box>
                    </Box>

                    {/* Period */}
                    <Box
                      component="td"
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {row.type === "insurance"
                          ? formatInsurancePeriod(
                              row.insurance_start_date,
                              row.insurance_end_date,
                            )
                          : formatPeriod(row.period_km, row.period_days)}
                      </Typography>
                    </Box>

                    {/* Last completed (or insurance start date) */}
                    <Box
                      component="td"
                      sx={{ display: { xs: "none", md: "table-cell" } }}
                    >
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {row.type === "insurance"
                          ? "—"
                          : row.last_completed_at
                            ? formatDate(row.last_completed_at)
                            : "—"}
                      </Typography>
                    </Box>

                    {/* Last odometer */}
                    <Box
                      component="td"
                      sx={{
                        display: { xs: "none", md: "table-cell" },
                        textAlign: "right",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{ fontVariantNumeric: "tabular-nums" }}
                      >
                        {row.last_odometer != null
                          ? `${formatNumber(row.last_odometer)} км`
                          : "—"}
                      </Typography>
                    </Box>

                    {/* Remaining */}
                    <Box
                      component="td"
                      sx={{
                        display: { xs: "none", md: "table-cell" },
                        textAlign: "right",
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontVariantNumeric: "tabular-nums",
                          color: remainingColor(row.status),
                          fontWeight:
                            row.status === "overdue" || row.status === "due_soon"
                              ? 500
                              : 400,
                        }}
                      >
                        {formatRemaining(
                          row.remaining_km,
                          row.remaining_days,
                          row.status,
                        )}
                      </Typography>
                    </Box>

                    {/* Status chip */}
                    <Box component="td">
                      <Chip
                        label={STATUS_LABELS[row.status]}
                        size="small"
                        color={STATUS_MUI_COLORS[row.status]}
                        variant="filled"
                        sx={{ fontWeight: 500 }}
                      />
                    </Box>

                    {/* Actions */}
                    <Box component="td">
                      <ServiceProcedureActions
                        procedureId={row.id}
                        canUndo={row.records_count > 0}
                      />
                    </Box>
                  </tr>
                ))}
              </tbody>
            </Box>
          </Box>
        </CardContent>
      </Card>
    </Stack>
  );
}
