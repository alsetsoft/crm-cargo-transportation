"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { createExpenseAction, updateExpenseAction } from "@/actions/expenses";
import { LinkBehavior } from "@/components/crm/link-behavior";
import type { ExpenseRow } from "@/lib/data/expenses";
import { toast } from "@/lib/toast";
import {
  expenseInputSchema,
  type ExpenseFormInput,
  type ExpenseInput,
} from "@/lib/validation/expense";

type OrderOption = { id: string; number: string; client_name: string };

type ExpenseFormPageProps = (
  | { mode: "create" }
  | { mode: "edit"; expense: ExpenseRow }
) & {
  orderOptions: OrderOption[];
};

function todayIso(): string {
  const d = new Date();
  const pad = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

export function ExpenseFormPage(props: ExpenseFormPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const expense = props.mode === "edit" ? props.expense : undefined;

  const { control, handleSubmit } = useForm<ExpenseFormInput, unknown, ExpenseInput>({
    resolver: zodResolver(expenseInputSchema),
    defaultValues: {
      name: expense?.name ?? "",
      amount_uah: expense?.amount_uah ?? ("" as unknown as number),
      spent_at: expense?.spent_at ?? todayIso(),
      order_id: expense?.order_id ?? "none",
      notes: expense?.notes ?? "",
    },
  });

  const onSubmit = (values: ExpenseInput) => {
    startTransition(async () => {
      const result =
        props.mode === "create"
          ? await createExpenseAction(values)
          : await updateExpenseAction(props.expense.id, values);

      if (result.ok) {
        toast.success(
          props.mode === "create" ? "Витрату додано" : "Витрату оновлено",
        );
        router.push("/expenses");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 3 }}
        >
          {/* Row 1: name */}
          <Controller
            control={control}
            name="name"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                label="Назва"
                placeholder="Ремонт зчеплення, паливо…"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          {/* Row 2: amount_uah + spent_at */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              control={control}
              name="amount_uah"
              render={({ field, fieldState }) => (
                <TextField
                  label="Сума, ₴"
                  placeholder="0"
                  type="text"
                  inputProps={{ inputMode: "decimal" }}
                  name={field.name}
                  inputRef={field.ref}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={(field.value as number | string | undefined) ?? ""}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name="spent_at"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="Дата"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </Stack>

          {/* Row 3: order_id */}
          <Controller
            control={control}
            name="order_id"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? "none"}
                select
                label="Замовлення (необов'язково)"
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
                SelectProps={{ MenuProps: { disableScrollLock: true } }}
              >
                <MenuItem value="none">Без прив&apos;язки</MenuItem>
                {props.orderOptions.map((o) => (
                  <MenuItem key={o.id} value={o.id}>
                    №{o.number} · {o.client_name}
                  </MenuItem>
                ))}
              </TextField>
            )}
          />

          {/* Row 4: notes */}
          <Controller
            control={control}
            name="notes"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label="Примітки"
                multiline
                rows={3}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

          {/* Action bar */}
          <Stack
            direction="row"
            justifyContent="flex-end"
            spacing={1.5}
            sx={{
              borderTop: 1,
              borderColor: "divider",
              pt: 2.5,
              mt: 1,
            }}
          >
            <Button
              component={LinkBehavior}
              href="/expenses"
              variant="outlined"
              disabled={isPending}
            >
              Скасувати
            </Button>
            <Button
              type="submit"
              variant="contained"
              size="large"
              disabled={isPending}
            >
              {isPending
                ? "Збереження..."
                : props.mode === "create"
                  ? "Створити"
                  : "Зберегти"}
            </Button>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
