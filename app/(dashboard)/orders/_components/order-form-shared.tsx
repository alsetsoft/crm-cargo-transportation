"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Typography from "@mui/material/Typography";

import {
  ORDER_STATUS_LABELS,
  PAYMENT_FORM_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";
import type { OrderExpenseRow, OrderRow } from "@/lib/data/orders";
import { formatPercent, formatUahPrecise } from "@/lib/format";
import {
  orderInputSchema,
  type OrderFormInput,
  type OrderInput,
} from "@/lib/validation/order";

export type ClientOption = { id: string; name: string; code: string };
export type DriverOption = {
  id: string;
  full_name: string;
  commission_per_km_uah: number;
};
export type VehicleOption = { id: string; unit: string; plate: string };

function toDateTimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

type UseOrderFormArgs = {
  order?: OrderRow;
  expenses?: OrderExpenseRow[];
  defaultNumber?: string;
  drivers: DriverOption[];
};

export function useOrderForm({
  order,
  expenses = [],
  defaultNumber,
  drivers,
}: UseOrderFormArgs) {
  const form = useForm<OrderFormInput, unknown, OrderInput>({
    resolver: zodResolver(orderInputSchema),
    defaultValues: {
      number: order?.number ?? defaultNumber ?? "",
      client_id: order?.client_id ?? "",
      loading_place: order?.loading_place ?? "",
      unloading_place: order?.unloading_place ?? "",
      driver_id: order?.driver_id ?? "none",
      vehicle_id: order?.vehicle_id ?? "none",
      departed_at: toDateTimeLocal(order?.departed_at),
      arrived_at: toDateTimeLocal(order?.arrived_at),
      volume_tons: order?.volume_tons ?? undefined,
      distance_km: order?.distance_km ?? ("" as unknown as number),
      price_uah: order?.price_uah ?? ("" as unknown as number),
      price_per_km_override_uah: order?.price_per_km_override_uah ?? undefined,
      driver_commission_override_uah:
        order?.driver_commission_override_uah ?? undefined,
      payment_form: order?.payment_form ?? "bank_transfer",
      payment_status: order?.payment_status ?? "unpaid",
      refuels_count: order?.refuels_count ?? 0,
      odometer_start: order?.odometer_start ?? undefined,
      odometer_end: order?.odometer_end ?? undefined,
      fuel_cost_uah: order?.fuel_cost_uah ?? 0,
      expenses: expenses.map((e) => ({
        name: e.name,
        amount_uah: e.amount_uah,
      })),
      status: order?.status ?? "new",
      notes: order?.notes ?? "",
    },
  });

  const expensesField = useFieldArray({
    control: form.control,
    name: "expenses",
  });

  const watched = useWatch({ control: form.control });
  const watchedDriverId = useWatch({
    control: form.control,
    name: "driver_id",
  });
  const watchedDistanceKm = useWatch({
    control: form.control,
    name: "distance_km",
  });

  const preview = useMemo(() => {
    const price = Number(watched.price_uah) || 0;
    const distance = Number(watched.distance_km) || 0;
    const fuelCost = Number(watched.fuel_cost_uah) || 0;
    const driverId =
      watched.driver_id && watched.driver_id !== "none"
        ? watched.driver_id
        : null;
    const driver = driverId ? drivers.find((d) => d.id === driverId) : null;
    const driverCommissionPerKm =
      Number(driver?.commission_per_km_uah ?? 0) || 0;

    const overridePricePerKm =
      watched.price_per_km_override_uah === "" ||
      watched.price_per_km_override_uah == null
        ? null
        : Number(watched.price_per_km_override_uah);
    const overrideCommission =
      watched.driver_commission_override_uah === "" ||
      watched.driver_commission_override_uah == null
        ? null
        : Number(watched.driver_commission_override_uah);

    const pricePerKm =
      overridePricePerKm ?? (distance > 0 ? price / distance : null);
    const commission = overrideCommission ?? driverCommissionPerKm * distance;

    const expensesTotal = (watched.expenses ?? []).reduce(
      (sum, e) => sum + (Number(e?.amount_uah) || 0),
      0,
    );

    const profit = price - fuelCost - commission - expensesTotal;
    const profitability = price > 0 ? (profit / price) * 100 : null;

    return {
      pricePerKm,
      commission,
      driverCommissionPerKm,
      expensesTotal,
      profit,
      profitability,
    };
  }, [watched, drivers]);

  const price = Number(watched.price_uah) || 0;
  const distance = Number(watched.distance_km) || 0;

  useEffect(() => {
    if (price > 0 && distance > 0) {
      form.setValue("price_per_km_override_uah", price / distance, {
        shouldDirty: false,
      });
    }
  }, [price, distance, form]);

  useEffect(() => {
    if (!watchedDriverId || watchedDriverId === "none") {
      form.setValue("driver_commission_override_uah", undefined, {
        shouldDirty: true,
        shouldTouch: true,
      });
      return;
    }
    const selected = drivers.find((d) => d.id === watchedDriverId);
    const rate = Number(selected?.commission_per_km_uah ?? 0) || 0;
    if (rate <= 0) return;
    const dist = Number(watchedDistanceKm) || 0;
    const next = dist > 0 ? rate * dist : rate;
    form.setValue("driver_commission_override_uah", next, {
      shouldDirty: true,
      shouldTouch: true,
    });
  }, [watchedDriverId, watchedDistanceKm, drivers, form]);

  return { form, expensesField, preview };
}

export type OrderFormController = ReturnType<typeof useOrderForm>;

type OrderFormBodyProps = {
  form: OrderFormController["form"];
  expensesField: OrderFormController["expensesField"];
  preview: OrderFormController["preview"];
  clients: ClientOption[];
  drivers: DriverOption[];
  vehicles: VehicleOption[];
};

export function OrderFormBody({
  form,
  expensesField,
  preview,
  clients,
  drivers,
  vehicles,
}: OrderFormBodyProps) {
  const { control } = form;

  return (
    <Stack spacing={3}>
      {/* ── Basics: number, client, status ──────────────────────────── */}
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Основне
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            control={control}
            name="number"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="№"
                placeholder="1024"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{ width: { sm: 110 }, flexShrink: 0 }}
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="client_id"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Замовник"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                sx={{ flexGrow: 1 }}
                SelectProps={{ MenuProps: { disableScrollLock: true } }}
              >
                {clients.map((c) => (
                  <MenuItem key={c.id} value={c.id}>
                    {c.code} · {c.name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="status"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Статус"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                sx={{ width: { sm: 160 }, flexShrink: 0 }}
                fullWidth
                SelectProps={{ MenuProps: { disableScrollLock: true } }}
              >
                {Object.entries(ORDER_STATUS_LABELS).map(([v, l]) => (
                  <MenuItem key={v} value={v}>
                    {l}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>
      </Stack>

      <Divider />

      {/* ── Route ────────────────────────────────────────────────────── */}
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Маршрут
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            control={control}
            name="loading_place"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label="Початкова точка"
                placeholder="Київ, вул. Промислова, 1"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="unloading_place"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label="Кінцева точка"
                placeholder="Львів, вул. Городоцька, 200"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        </Stack>
      </Stack>

      <Divider />

      {/* ── Crew ─────────────────────────────────────────────────────── */}
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Екіпаж
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            control={control}
            name="driver_id"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? "none"}
                select
                label="Водій"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                SelectProps={{ MenuProps: { disableScrollLock: true } }}
              >
                <MenuItem value="none">Не призначено</MenuItem>
                {drivers.map((d) => (
                  <MenuItem key={d.id} value={d.id}>
                    {d.full_name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="vehicle_id"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? "none"}
                select
                label="Авто"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                SelectProps={{ MenuProps: { disableScrollLock: true } }}
              >
                <MenuItem value="none">Не призначено</MenuItem>
                {vehicles.map((v) => (
                  <MenuItem key={v.id} value={v.id}>
                    {v.plate} · {v.unit}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>
      </Stack>

      <Divider />

      {/* ── Schedule ─────────────────────────────────────────────────── */}
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Розклад
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            control={control}
            name="departed_at"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                type="datetime-local"
                label="Час відправлення"
                InputLabelProps={{ shrink: true }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="arrived_at"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                type="datetime-local"
                label="Час прибуття"
                InputLabelProps={{ shrink: true }}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        </Stack>
      </Stack>

      <Divider />

      {/* ── Cargo & distance ─────────────────────────────────────────── */}
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Вантаж та відстань
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            control={control}
            name="volume_tons"
            render={({ field, fieldState }) => (
              <TextField
                label="Об'єм, т"
                placeholder="0.0"
                inputProps={{ inputMode: "decimal", step: "0.1" }}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={(field.value as number | string | undefined) ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="distance_km"
            render={({ field, fieldState }) => (
              <TextField
                label="Кілометри"
                placeholder="0"
                inputProps={{ inputMode: "decimal", step: "0.1" }}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={(field.value as number | string | undefined) ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="odometer_start"
            render={({ field, fieldState }) => (
              <TextField
                label="ОДО старт"
                placeholder="0"
                inputProps={{ inputMode: "numeric", step: "1" }}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={(field.value as number | string | undefined) ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="odometer_end"
            render={({ field, fieldState }) => (
              <TextField
                label="ОДО кінець"
                placeholder="0"
                inputProps={{ inputMode: "numeric", step: "1" }}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={(field.value as number | string | undefined) ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        </Stack>
      </Stack>

      <Divider />

      {/* ── Pricing ──────────────────────────────────────────────────── */}
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Фінанси
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            control={control}
            name="price_uah"
            render={({ field, fieldState }) => (
              <TextField
                label="Ціна, ₴"
                placeholder="0.00"
                inputProps={{ inputMode: "decimal", step: "0.01" }}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={(field.value as number | string | undefined) ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="price_per_km_override_uah"
            render={({ field, fieldState }) => (
              <TextField
                label="Ціна за км, ₴"
                placeholder="0.00"
                inputProps={{ inputMode: "decimal", step: "0.01" }}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={(field.value as number | string | undefined) ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="driver_commission_override_uah"
            render={({ field, fieldState }) => (
              <TextField
                label="Комісія водія, ₴"
                placeholder="0.00"
                inputProps={{ inputMode: "decimal", step: "0.01" }}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={(field.value as number | string | undefined) ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        </Stack>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            control={control}
            name="payment_form"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Форма оплати"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                SelectProps={{ MenuProps: { disableScrollLock: true } }}
              >
                {Object.entries(PAYMENT_FORM_LABELS).map(([v, l]) => (
                  <MenuItem key={v} value={v}>
                    {l}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
          <Controller
            control={control}
            name="payment_status"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                select
                label="Статус оплати"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                SelectProps={{ MenuProps: { disableScrollLock: true } }}
              >
                {Object.entries(PAYMENT_STATUS_LABELS).map(([v, l]) => (
                  <MenuItem key={v} value={v}>
                    {l}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />
        </Stack>
      </Stack>

      <Divider />

      {/* ── Fuel ─────────────────────────────────────────────────────── */}
      <Stack spacing={2}>
        <Typography variant="subtitle2" color="text.secondary">
          Паливо
        </Typography>
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <Controller
            control={control}
            name="refuels_count"
            render={({ field, fieldState }) => (
              <TextField
                label="Заправки"
                placeholder="0"
                inputProps={{ inputMode: "numeric", step: "1" }}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={(field.value as number | string | undefined) ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
          <Controller
            control={control}
            name="fuel_cost_uah"
            render={({ field, fieldState }) => (
              <TextField
                label="Вартість ДП, ₴"
                placeholder="0.00"
                inputProps={{ inputMode: "decimal", step: "0.01" }}
                name={field.name}
                ref={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={(field.value as number | string | undefined) ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />
        </Stack>
      </Stack>

      <Divider />

      {/* ── Expenses (nested field array) ────────────────────────────── */}
      <Stack spacing={2}>
        <Stack
          direction="row"
          alignItems="center"
          justifyContent="space-between"
        >
          <Typography variant="h6" component="h2">
            Інші витрати
          </Typography>
          <Button
            type="button"
            variant="outlined"
            size="small"
            startIcon={<Plus size={16} />}
            onClick={() => expensesField.append({ name: "", amount_uah: 0 })}
          >
            Додати витрату
          </Button>
        </Stack>

        {expensesField.fields.length === 0 ? (
          <Typography variant="body2" color="text.secondary">
            Додаткових витрат немає.
          </Typography>
        ) : (
          <Stack spacing={1}>
            {expensesField.fields.map((fieldItem, index) => (
              <Stack
                key={fieldItem.id}
                direction={{ xs: "column", sm: "row" }}
                spacing={1}
                alignItems={{ sm: "flex-start" }}
              >
                <Controller
                  control={control}
                  name={`expenses.${index}.name`}
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      label="Назва"
                      placeholder="Платний участок, навантаження…"
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      sx={{ flexGrow: 1 }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name={`expenses.${index}.amount_uah`}
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Сума, ₴"
                      inputProps={{ inputMode: "decimal" }}
                      name={field.name}
                      ref={field.ref}
                      onBlur={field.onBlur}
                      onChange={field.onChange}
                      value={
                        (field.value as number | string | undefined) ?? ""
                      }
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      sx={{ width: { sm: 160 }, flexShrink: 0 }}
                      fullWidth
                    />
                  )}
                />
                <IconButton
                  type="button"
                  color="error"
                  aria-label="Видалити витрату"
                  onClick={() => expensesField.remove(index)}
                  sx={{
                    alignSelf: { xs: "flex-end", sm: "auto" },
                    mt: { sm: 0.5 },
                    p: 1.5,
                  }}
                >
                  <Trash2 size={18} />
                </IconButton>
              </Stack>
            ))}
          </Stack>
        )}

        {/* Live profitability preview */}
        <Paper
          variant="outlined"
          sx={{ p: 2, borderRadius: 2 }}
        >
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", sm: "1fr 1fr" },
              gap: 1,
            }}
          >
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Інші витрати:
              </Typography>
              <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatUahPrecise(preview.expensesTotal, 2)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" color="text.secondary">
                Комісія водія:
              </Typography>
              <Typography variant="body2" sx={{ fontVariantNumeric: "tabular-nums" }}>
                {formatUahPrecise(preview.commission, 2)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" fontWeight={500}>
                Чистий прибуток:
              </Typography>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{
                  fontVariantNumeric: "tabular-nums",
                  color: preview.profit >= 0 ? "success.main" : "warning.main",
                }}
              >
                {formatUahPrecise(preview.profit, 2)}
              </Typography>
            </Stack>
            <Stack direction="row" justifyContent="space-between">
              <Typography variant="body2" fontWeight={500}>
                Рентабельність:
              </Typography>
              <Typography
                variant="body2"
                fontWeight={500}
                sx={{ fontVariantNumeric: "tabular-nums" }}
              >
                {formatPercent(preview.profitability)}
              </Typography>
            </Stack>
          </Box>
        </Paper>
      </Stack>

      <Divider />

      {/* ── Notes ────────────────────────────────────────────────────── */}
      <Controller
        control={control}
        name="notes"
        render={({ field, fieldState }) => (
          <TextField
            {...field}
            value={field.value ?? ""}
            label="Примітки"
            multiline
            rows={3}
            error={!!fieldState.error}
            helperText={fieldState.error?.message}
            fullWidth
          />
        )}
      />
    </Stack>
  );
}
