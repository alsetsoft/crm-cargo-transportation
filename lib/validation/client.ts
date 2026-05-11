import { z } from "zod";

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
  name: z.string().trim().min(1, "Назва обовʼязкова").max(200),
  contact_person: optionalString,
  phone: optionalString,
  email: z
    .string()
    .email("Невірний email")
    .max(200)
    .optional()
    .or(z.literal("").transform(() => undefined)),
  edrpou: optionalString,
  debt_uah: z.preprocess(
    (v) => (v === "" || v == null ? 0 : Number(v)),
    z.number().min(0).max(1e12),
  ),
  status: clientStatusEnum.default("active"),
  notes: optionalLongString,
});

export type ClientFormInput = z.input<typeof clientInputSchema>;
export type ClientInput = z.output<typeof clientInputSchema>;
