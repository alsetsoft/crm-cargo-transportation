import { z } from "zod";

import { vehicleDocumentSchema } from "./vehicle-document";

const optionalString = z
  .string()
  .max(2000)
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalNumber = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().min(0).optional(),
);

const optionalUuid = z
  .string()
  .uuid()
  .optional()
  .or(z.literal("").transform(() => undefined))
  .or(z.literal("none").transform(() => undefined));

const optionalDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Невірна дата")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const vehicleStatusEnum = z.enum(["on_trip", "service", "available"]);

export const vehicleInputSchema = z.object({
  unit: z.string().trim().min(1, "Введіть марку/модель").max(120),
  plate: z.string().trim().min(2, "Введіть держномер").max(20),
  current_driver_id: optionalUuid,
  fuel_norm_l_100km: optionalNumber,
  status: vehicleStatusEnum.default("available"),
  service_next_date: optionalDate,
  service_next_odometer: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().int().min(0).max(10_000_000).optional(),
  ),
  documents: vehicleDocumentSchema.array().default([]),
  notes: optionalString,
});

export type VehicleFormInput = z.input<typeof vehicleInputSchema>;
export type VehicleInput = z.output<typeof vehicleInputSchema>;
