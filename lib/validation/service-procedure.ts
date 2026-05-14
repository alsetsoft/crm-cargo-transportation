import { z } from "zod";

import { vehicleDocumentTypeEnum } from "./vehicle-document";

const optionalNotes = z
  .string()
  .max(500)
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalPositiveInt = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().int().positive().optional(),
);

export const serviceProcedureInputSchema = z
  .object({
    type: vehicleDocumentTypeEnum,
    period_km: optionalPositiveInt,
    period_days: optionalPositiveInt,
    notes: optionalNotes,
  })
  .refine((v) => v.period_km != null || v.period_days != null, {
    message: "Вкажіть період у км або днях",
    path: ["period_km"],
  });

export type ServiceProcedureFormInput = z.input<typeof serviceProcedureInputSchema>;
export type ServiceProcedureInput = z.output<typeof serviceProcedureInputSchema>;
