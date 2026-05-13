import { z } from "zod";

export const vehicleDocumentTypeEnum = z.enum([
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

export const vehicleDocumentSchema = z.object({
  type: vehicleDocumentTypeEnum,
  valid_until: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Невірна дата"),
  notes: optionalNotes,
});

export type VehicleDocumentFormInput = z.input<typeof vehicleDocumentSchema>;
export type VehicleDocumentInput = z.output<typeof vehicleDocumentSchema>;
