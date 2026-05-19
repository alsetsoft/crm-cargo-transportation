import { z } from "zod";

import { normalizeQuotes } from "@/lib/text";

const optionalString = z
  .string()
  .max(500)
  .optional()
  .or(z.literal("").transform(() => undefined));

const optionalLongString = z
  .string()
  .max(2000)
  .optional()
  .or(z.literal("").transform(() => undefined));

export const clientStatusEnum = z.enum([
  "active",
  "inactive",
  "awaiting_payment",
]);

export const clientInputSchema = z.object({
  code: z.string().trim().min(1, "Код обовʼязковий").max(50),
  // Quotes in the legal name are silently normalised to Ukrainian
  // guillemets («...») on save, so historical mixes of "...", “...”,
  // and «...» converge to a single canonical style.
  name: z
    .string()
    .trim()
    .min(1, "Назва обовʼязкова")
    .max(200)
    .transform(normalizeQuotes),
  contact_person: optionalString,
  phone: optionalString,
  email: z
    .string()
    .email("Невірний email")
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  status: clientStatusEnum.default("active"),
  notes: optionalLongString,
});

export type ClientFormInput = z.input<typeof clientInputSchema>;
export type ClientInput = z.output<typeof clientInputSchema>;
