"use client";

import { Plus, Trash2 } from "lucide-react";
import { useEffect, useMemo } from "react";
import { useFieldArray, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
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

export { Form };

function toDateTimeLocal(iso: string | null | undefined): string {
  if (!iso) return "";
  // 2026-05-13T10:00:00+00:00 → 2026-05-13T10:00 (for input[type=datetime-local])
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

/**
 * Shared react-hook-form controller for the order form — owns default values,
 * the expenses field array, and the live profitability preview. Used by both
 * the edit dialog and the standalone create page.
 */
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

/**
 * The full set of order form sections — shared between the dialog and page.
 * Інформація + Операційні дані on the left, Фінанси on the right.
 */
export function OrderFormBody({
  form,
  expensesField,
  preview,
  clients,
  drivers,
  vehicles,
}: OrderFormBodyProps) {
  // ── Інформація ──────────────────────────────────────
  const infoSection = (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Інформація
      </h3>
      <div className="grid gap-3 sm:grid-cols-6">
        <FormField
          control={form.control}
          name="number"
          render={({ field }) => (
            <FormItem className="sm:col-span-1">
              <FormLabel>№</FormLabel>
              <FormControl>
                <Input placeholder="1024" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="client_id"
          render={({ field }) => (
            <FormItem className="sm:col-span-3">
              <FormLabel>Замовник</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Оберіть клієнта" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {clients.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.code} · {c.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="sm:col-span-2">
              <FormLabel>Статус</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(ORDER_STATUS_LABELS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="loading_place"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Початкова точка</FormLabel>
              <FormControl>
                <Input
                  placeholder="Київ, вул. Промислова, 1"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="unloading_place"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Кінцева точка</FormLabel>
              <FormControl>
                <Input
                  placeholder="Львів, вул. Городоцька, 200"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="driver_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Водій</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? "none"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Не призначено" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Не призначено</SelectItem>
                  {drivers.map((d) => (
                    <SelectItem key={d.id} value={d.id}>
                      {d.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="vehicle_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Авто</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? "none"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Не призначено" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Не призначено</SelectItem>
                  {vehicles.map((v) => (
                    <SelectItem key={v.id} value={v.id}>
                      {v.plate} · {v.unit}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="departed_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Час відправлення</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="arrived_at"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Час прибуття</FormLabel>
              <FormControl>
                <Input
                  type="datetime-local"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <FormField
        control={form.control}
        name="notes"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Примітки</FormLabel>
            <FormControl>
              <Textarea rows={2} {...field} value={field.value ?? ""} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </section>
  );

  // ── Операційні дані ──────────────────────────────────
  const opsSection = (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Операційні дані
      </h3>
      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        <NumberFormField
          name="volume_tons"
          label="Об'єм, т"
          step="0.1"
          form={form}
        />
        <NumberFormField
          name="odometer_start"
          label="ОДО старт"
          step="1"
          form={form}
        />
        <NumberFormField
          name="odometer_end"
          label="ОДО кінець"
          step="1"
          form={form}
        />
        <NumberFormField
          name="refuels_count"
          label="Заправки"
          step="1"
          form={form}
        />
        <NumberFormField
          name="fuel_cost_uah"
          label="Вартість ДП, ₴"
          step="0.01"
          form={form}
        />
      </div>
    </section>
  );

  // ── Фінанси ──────────────────────────────────────────
  const financeSection = (
    <section className="space-y-3">
      <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
        Фінанси
      </h3>
      <div className="grid gap-3 sm:grid-cols-2">
        <NumberFormField
          name="price_uah"
          label="Ціна, ₴"
          step="0.01"
          form={form}
        />
        <NumberFormField
          name="distance_km"
          label="Кілометри"
          step="0.1"
          form={form}
        />
        <NumberFormField
          name="price_per_km_override_uah"
          label="Ціна за км, ₴"
          step="0.01"
          form={form}
        />
        <NumberFormField
          name="driver_commission_override_uah"
          label="Комісія водія, ₴"
          step="0.01"
          form={form}
        />
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <FormField
          control={form.control}
          name="payment_form"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Форма оплати</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(PAYMENT_FORM_LABELS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="payment_status"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Статус оплати</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(PAYMENT_STATUS_LABELS).map(([v, l]) => (
                    <SelectItem key={v} value={v}>
                      {l}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <h4 className="text-sm font-medium">Інші витрати</h4>
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() =>
              expensesField.append({
                name: "",
                amount_uah: 0,
              })
            }
          >
            <Plus className="size-4" />
            Додати витрату
          </Button>
        </div>
        {expensesField.fields.length === 0 ? (
          <p className="text-xs text-muted-foreground">
            Додаткових витрат немає.
          </p>
        ) : (
          <div className="space-y-2">
            {expensesField.fields.map((row, index) => (
              <div
                key={row.id}
                className="grid gap-2 sm:grid-cols-[1fr_160px_auto] items-end rounded-md border border-border/60 p-2"
              >
                <FormField
                  control={form.control}
                  name={`expenses.${index}.name`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Назва</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Платний участок, навантаження…"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name={`expenses.${index}.amount_uah`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="text-xs">Сума, ₴</FormLabel>
                      <FormControl>
                        <Input
                          type="text"
                          inputMode="decimal"
                          name={field.name}
                          ref={field.ref}
                          onBlur={field.onBlur}
                          onChange={field.onChange}
                          value={
                            (field.value as number | string | undefined) ?? ""
                          }
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Видалити"
                  onClick={() => expensesField.remove(index)}
                >
                  <Trash2 className="size-4" />
                </Button>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="rounded-xl border border-border/60 bg-surface p-3 text-sm">
        <div className="grid gap-1 sm:grid-cols-2">
          <div className="flex justify-between">
            <span className="text-muted-foreground">Інші витрати:</span>
            <span className="tabular-nums">
              {formatUahPrecise(preview.expensesTotal, 2)}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">Комісія водія:</span>
            <span className="tabular-nums">
              {formatUahPrecise(preview.commission, 2)}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Чистий прибуток:</span>
            <span
              className={`tabular-nums ${preview.profit >= 0 ? "text-success" : "text-warning"}`}
            >
              {formatUahPrecise(preview.profit, 2)}
            </span>
          </div>
          <div className="flex justify-between font-medium">
            <span>Рентабельність:</span>
            <span className="tabular-nums">
              {formatPercent(preview.profitability)}
            </span>
          </div>
        </div>
      </div>
    </section>
  );

  return (
    <div className="grid gap-6 lg:grid-cols-2 lg:items-start">
      <div className="min-w-0 space-y-6">
        {infoSection}
        {opsSection}
      </div>
      <div className="min-w-0 space-y-6">{financeSection}</div>
    </div>
  );
}

type NumberFormFieldProps = {
  name: keyof OrderFormInput;
  label: string;
  step: string;
  form: OrderFormController["form"];
  placeholder?: string;
};

function NumberFormField({
  name,
  label,
  step,
  form,
  placeholder,
}: NumberFormFieldProps) {
  const isInteger = step === "1";
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="text"
              inputMode={isInteger ? "numeric" : "decimal"}
              placeholder={placeholder}
              name={field.name}
              ref={field.ref}
              onBlur={field.onBlur}
              onChange={field.onChange}
              value={(field.value as number | string | undefined) ?? ""}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
}
