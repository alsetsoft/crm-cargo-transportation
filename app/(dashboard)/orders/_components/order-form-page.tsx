"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { toast } from "sonner";

import { createOrderAction } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import type { OrderInput } from "@/lib/validation/order";

import {
  Form,
  OrderFormBody,
  useOrderForm,
  type ClientOption,
  type DriverOption,
  type VehicleOption,
} from "./order-form-shared";

type OrderFormPageProps = {
  defaultNumber?: string;
  clients: ClientOption[];
  drivers: DriverOption[];
  vehicles: VehicleOption[];
};

export function OrderFormPage({
  defaultNumber,
  clients,
  drivers,
  vehicles,
}: OrderFormPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const { form, expensesField, preview } = useOrderForm({
    defaultNumber,
    drivers,
  });

  const onSubmit = (values: OrderInput) => {
    startTransition(async () => {
      const result = await createOrderAction(values);

      if (result.ok) {
        toast.success("Замовлення створено");
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
          clients={clients}
          drivers={drivers}
          vehicles={vehicles}
        />
        <div className="flex justify-end gap-2 border-t border-border/60 pt-4">
          <Button type="button" variant="outline" asChild disabled={isPending}>
            <Link href="/orders">Скасувати</Link>
          </Button>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Збереження..." : "Створити"}
          </Button>
        </div>
      </form>
    </Form>
  );
}
