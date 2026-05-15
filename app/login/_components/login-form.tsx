"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";
import { toast } from "@/lib/toast";

import { signInAction } from "@/actions/auth";
import {
  signInSchema,
  type SignInFormInput,
  type SignInInput,
} from "@/lib/validation/auth";

type LoginFormProps = {
  redirectTo?: string;
};

export function LoginForm({ redirectTo }: LoginFormProps) {
  const [isPending, startTransition] = useTransition();

  const {
    control,
    handleSubmit,
  } = useForm<SignInFormInput, unknown, SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  const onSubmit = (values: SignInInput) => {
    startTransition(async () => {
      const result = await signInAction(values, redirectTo);
      // A successful sign-in throws via redirect() and never returns;
      // only the error branch ever lands here.
      if (result && !result.ok) {
        toast.error(result.error);
      }
    });
  };

  return (
    <Box
      component="form"
      onSubmit={handleSubmit(onSubmit)}
      noValidate
      sx={{
        borderRadius: 2,
        border: 1,
        borderColor: "divider",
        bgcolor: "background.paper",
        p: 3,
      }}
    >
      <Stack spacing={2}>
        <Controller
          control={control}
          name="email"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Email"
              type="email"
              autoComplete="email"
              placeholder="you@company.ua"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Controller
          control={control}
          name="password"
          render={({ field, fieldState }) => (
            <TextField
              {...field}
              label="Пароль"
              type="password"
              autoComplete="current-password"
              fullWidth
              error={!!fieldState.error}
              helperText={fieldState.error?.message}
            />
          )}
        />

        <Button
          type="submit"
          fullWidth
          variant="contained"
          size="large"
          disabled={isPending}
          sx={{ mt: 1 }}
        >
          {isPending ? "Вхід..." : "Увійти"}
        </Button>
      </Stack>
    </Box>
  );
}
