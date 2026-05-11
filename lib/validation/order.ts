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

export const orderStatusEnum = z.enum([
  "new",
  "in_progress",
  "completed",
  "cancelled",
]);
export const paymentFormEnum = z.enum(["cash", "bank_transfer", "card"]);
export const paymentStatusEnum = z.enum(["unpaid", "partial", "paid"]);

export const orderInputSchema = z.object({
  number: z.string().trim().min(1, "Введіть номер").max(50),
  client_id: z.string().uuid("Оберіть клієнта"),
  route_id: optionalUuid,
  driver_id: optionalUuid,
  vehicle_id: optionalUuid,

  volume_tons: optionalNumber,
  price_uah: requiredNumber(1e12),
  km_salary: optionalNumber,
  km_invoice: optionalNumber,

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
  actual_profit_uah: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(-1e10).max(1e10).optional(),
  ),

  status: orderStatusEnum.default("new"),
  notes: optionalString,
});

export type OrderFormInput = z.input<typeof orderInputSchema>;
export type OrderInput = z.output<typeof orderInputSchema>;
