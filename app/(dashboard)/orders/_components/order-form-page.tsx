"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { createOrderAction, updateOrderAction } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import type { OrderExpenseRow, OrderRow } from "@/lib/data/orders";
import type { OrderInput } from "@/lib/validation/order";

import {
  Form,
  OrderFormBody,
  useOrderForm,
  type ClientOption,
  type DriverOption,
  type VehicleOption,
} from "./order-form-shared";

type OrderFormPageProps = (
  | { mode: "create"; defaultNumber?: string }
  | { mode: "edit"; order: OrderRow; expenses: OrderExpenseRow[] }
) & {
  clients: ClientOption[];
  drivers: DriverOption[];
  vehicles: VehicleOption[];
};

export function OrderFormPage(props: OrderFormPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { form, expensesField, preview } = useOrderForm({
    defaultNumber: props.mode === "create" ? props.defaultNumber : undefined,
    order: props.mode === "edit" ? props.order : undefined,
    expenses: props.mode === "edit" ? props.expenses : undefined,
    drivers: props.drivers,
  });

  const onSubmit = (values: OrderInput) => {
    startTransition(async () => {
      const result =
        props.mode === "create"
          ? await createOrderAction(values)
          : await updateOrderAction(props.order.id, values);

      if (result.ok) {
        toast.success(
          props.mode === "create" ? "Замовлення створено" : "Замовлення оновлено",
        );
        router.push("/orders");
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="panel-card space-y-6 p-5 sm:p-6"
      >
        <OrderFormBody
          form={form}
          expensesField={expensesField}
          preview={preview}
          clients={props.clients}
          drivers={props.drivers}
          vehicles={props.vehicles}
        />
        <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
          <Button type="button" variant="outline" asChild disabled={isPending}>
            <Link href="/orders">Скасувати</Link>
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
