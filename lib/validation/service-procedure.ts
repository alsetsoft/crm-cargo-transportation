import { z } from "zod";

// Mirrors the Postgres enum `vehicle_document_type` (the column type on
// vehicle_service_procedures.type). The enum name is a historical relic
// from a former vehicle_documents table.
export const vehicleServiceTypeEnum = z.enum([
  "service_book",
  "insurance",
  "technical_inspection",
  "tachograph",
]);

const optionalNotes = z
  .string()
  .max(500)
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalPositiveInt = z.preprocess(
  (v) => (v === "" || v == null ? undefined : Number(v)),
  z.number().int().positive().optional(),
);

// YYYY-MM-DD strings from <input type="date">. Empty string → undefined.
const optionalDate = z
  .string()
  .regex(/^\d{4}-\d{2}-\d{2}$/, "Невірна дата")
  .optional()
  .or(z.literal("").transform(() => undefined));

export const serviceProcedureInputSchema = z
  .object({
    type: vehicleServiceTypeEnum,
    period_km: optionalPositiveInt,
    period_days: optionalPositiveInt,
    insurance_start_date: optionalDate,
    insurance_end_date: optionalDate,
    notes: optionalNotes,
  })
  .superRefine((v, ctx) => {
    if (v.type === "insurance") {
      // Insurance is a calendar event — start + end dates are required,
      // period fields are not used.
      if (!v.insurance_start_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Вкажіть дату початку дії",
          path: ["insurance_start_date"],
        });
      }
      if (!v.insurance_end_date) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Вкажіть дату закінчення",
          path: ["insurance_end_date"],
        });
      }
      if (
        v.insurance_start_date &&
        v.insurance_end_date &&
        v.insurance_end_date < v.insurance_start_date
      ) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Дата закінчення не може бути ранішою за дату початку дії",
          path: ["insurance_end_date"],
        });
      }
    } else {
      // Non-insurance types use period-based scheduling — at least one
      // period field is required.
      if (v.period_km == null && v.period_days == null) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          message: "Вкажіть період у км або днях",
          path: ["period_days"],
        });
      }
    }
  });

export type ServiceProcedureFormInput = z.input<typeof serviceProcedureInputSchema>;
export type ServiceProcedureInput = z.output<typeof serviceProcedureInputSchema>;
