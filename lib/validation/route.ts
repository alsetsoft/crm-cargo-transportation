import { z } from "zod";

const optionalString = z
  .string()
  .max(2000)
  .optional()
  .or(z.literal("").transform(() => undefined));

export const routeStatusEnum = z.enum(["active", "archived"]);

export const routeInputSchema = z.object({
  name: z.string().trim().min(1, "Назва обовʼязкова").max(200),
  point_a: z.string().trim().min(1, "Точка А обовʼязкова").max(200),
  point_b: z.string().trim().min(1, "Точка Б обовʼязкова").max(200),
  distance_km: z.coerce
    .number({ message: "Введіть кілометраж" })
    .positive("Має бути більше 0")
    .max(100000, "Перевищено допустиму відстань"),
  typical_duration_hours: z.preprocess(
    (v) => (v === "" || v == null ? undefined : Number(v)),
    z.number().min(0).max(1000).optional(),
  ),
  status: routeStatusEnum.default("active"),
  notes: optionalString,
});

export type RouteFormInput = z.input<typeof routeInputSchema>;
export type RouteInput = z.output<typeof routeInputSchema>;
