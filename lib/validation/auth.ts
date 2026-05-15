import { z } from "zod";

export const signInSchema = z.object({
  email: z.string().trim().toLowerCase().email("Невірний email"),
  password: z.string().min(1, "Введіть пароль"),
});

export type SignInFormInput = z.input<typeof signInSchema>;
export type SignInInput = z.output<typeof signInSchema>;
