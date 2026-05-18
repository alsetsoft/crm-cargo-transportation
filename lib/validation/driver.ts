import { z } from "zod";

const optionalString = z
  .string()
  .max(2000)
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalUuid = z
  .string()
  .uuid()
  .optional()
  .or(z.literal("").transform(() => undefined))
  .or(z.literal("none").transform(() => undefined));

const commission = z.preprocess(
  (v) => (v === "" || v == null ? 0 : Number(v)),
  z.number().min(0).max(1e6),
);

export const driverStatusEnum = z.enum(["on_trip", "available", "unavailable"]);

export const driverInputSchema = z.object({
  full_name: z.string().trim().min(2, "Введіть ПІБ водія").max(160),
  phone: z
    .string()
    .max(40)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  current_vehicle_id: optionalUuid,
  status: driverStatusEnum.default("available"),
  commission_per_km_uah: commission.default(0),
  notes: optionalString,
});

export type DriverFormInput = z.input<typeof driverInputSchema>;
export type DriverInput = z.output<typeof driverInputSchema>;
