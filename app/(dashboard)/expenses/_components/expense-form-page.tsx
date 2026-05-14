"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createExpenseAction, updateExpenseAction } from "@/actions/expenses";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { ExpenseRow } from "@/lib/data/expenses";
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

  const form = useForm<ExpenseFormInput, unknown, ExpenseInput>({
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
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="panel-card space-y-4 p-5 sm:p-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Назва</FormLabel>
              <FormControl>
                <Input placeholder="Ремонт зчеплення, паливо…" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="amount_uah"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Сума, ₴</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="0"
                    name={field.name}
                    ref={field.ref}
                    onBlur={field.onBlur}
                    onChange={field.onChange}
                    value={(field.value as number | string | undefined) ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="spent_at"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Дата</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="order_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Замовлення (необов&apos;язково)</FormLabel>
              <Select
                onValueChange={field.onChange}
                value={field.value ?? "none"}
              >
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Без прив'язки" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Без прив&apos;язки</SelectItem>
                  {props.orderOptions.map((o) => (
                    <SelectItem key={o.id} value={o.id}>
                      №{o.number} · {o.client_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="notes"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Примітки</FormLabel>
              <FormControl>
                <Textarea rows={3} {...field} value={field.value ?? ""} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
          <Button type="button" variant="outline" asChild disabled={isPending}>
            <Link href="/expenses">Скасувати</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending
              ? "Збереження..."
              : props.mode === "create"
                ? "Створити"
                : "Зберегти"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
