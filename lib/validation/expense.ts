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

const requiredDate = z.string().min(1, "Введіть дату");

const amount = z.preprocess(
  (v) => (v === "" || v == null ? NaN : Number(v)),
  z.number().min(0).max(1e10),
);

export const expenseInputSchema = z.object({
  name: z.string().trim().min(1, "Введіть назву").max(160),
  amount_uah: amount,
  spent_at: requiredDate,
  order_id: optionalUuid,
  notes: optionalString,
});

export type ExpenseFormInput = z.input<typeof expenseInputSchema>;
export type ExpenseInput = z.output<typeof expenseInputSchema>;
