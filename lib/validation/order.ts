import { z } from "zod";

const optionalString = z
  .string()
  .max(2000)
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalNumber = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().min(0).optional(),
);

const optionalInt = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().int().min(0).optional(),
);

const requiredNumber = (max: number) =>
  z.preprocess(
    (v) => (v === "" || v == null ? NaN : Number(v)),
    z.number().min(0).max(max),
  );

const optionalUuid = z
  .string()
  .uuid()
  .optional()
  .or(z.literal("").transform(() => undefined))
  .or(z.literal("none").transform(() => undefined));

const optionalDateTime = z
  .string()
  .min(1)
  .optional()
  .or(z.literal("").transform(() => undefined));

export const orderStatusEnum = z.enum([
  "new",
  "in_progress",
  "completed",
  "cancelled",
]);
export const paymentFormEnum = z.enum(["cash", "bank_transfer", "card"]);
export const paymentStatusEnum = z.enum(["unpaid", "partial", "paid"]);

export const orderExpenseSchema = z.object({
  name: z.string().trim().min(1, "Введіть назву").max(100),
  amount_uah: z.preprocess(
    (v) => (v === "" || v == null ? NaN : Number(v)),
    z.number().min(0).max(1e10),
  ),
});

export const orderInputSchema = z
  .object({
    number: z.string().trim().min(1, "Введіть номер").max(50),
    client_id: z.string().uuid("Оберіть клієнта"),
    loading_place: optionalString,
    unloading_place: optionalString,
    driver_id: optionalUuid,
    vehicle_id: optionalUuid,

    departed_at: optionalDateTime,
    arrived_at: optionalDateTime,

    volume_tons: optionalNumber,
    distance_km: requiredNumber(1_000_000),
    price_uah: requiredNumber(1e12),
    price_per_km_override_uah: optionalNumber,
    driver_commission_override_uah: optionalNumber,

    payment_form: paymentFormEnum.default("bank_transfer"),
    payment_status: paymentStatusEnum.default("unpaid"),

    refuels_count: z.preprocess(
      (v) => (v === "" || v == null ? 0 : Number(v)),
      z.number().int().min(0).max(99),
    ),
    odometer_start: optionalInt,
    odometer_end: optionalInt,
    fuel_cost_uah: z.preprocess(
      (v) => (v === "" || v == null ? 0 : Number(v)),
      z.number().min(0).max(1e10),
    ),

    expenses: orderExpenseSchema.array().default([]),

    status: orderStatusEnum.default("new"),
    notes: optionalString,
  })
  .refine(
    (v) =>
      !v.departed_at ||
      !v.arrived_at ||
      new Date(v.arrived_at) >= new Date(v.departed_at),
    {
      message: "Прибуття не може бути раніше відправлення",
      path: ["arrived_at"],
    },
  );

export type OrderFormInput = z.input<typeof orderInputSchema>;
export type OrderInput = z.output<typeof orderInputSchema>;
export type OrderExpenseFormInput = z.input<typeof orderExpenseSchema>;
export type OrderExpenseInput = z.output<typeof orderExpenseSchema>;
