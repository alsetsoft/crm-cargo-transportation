"use client";

import { Pencil } from "lucide-react";
import { useState, useTransition } from "react";
import { toast } from "sonner";

import { updateOrderAction } from "@/actions/orders";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
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

type OrderFormDialogProps = {
  order: OrderRow;
  expenses?: OrderExpenseRow[];
  clients: ClientOption[];
  drivers: DriverOption[];
  vehicles: VehicleOption[];
};

export function OrderFormDialog({
  order,
  expenses = [],
  clients,
  drivers,
  vehicles,
}: OrderFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const { form, expensesField, preview } = useOrderForm({
    order,
    expenses,
    drivers,
  });

  const onSubmit = (values: OrderInput) => {
    startTransition(async () => {
      const result = await updateOrderAction(order.id, values);

      if (result.ok) {
        toast.success("Замовлення оновлено");
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.error);
      }
    });
  };

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) form.reset();
      }}
    >
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon-sm" aria-label="Редагувати">
          <Pencil className="size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl lg:max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Редагувати замовлення</DialogTitle>
          <DialogDescription>
            Інформація, фінанси та операційні дані рейсу.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <OrderFormBody
              form={form}
              expensesField={expensesField}
              preview={preview}
              clients={clients}
              drivers={drivers}
              vehicles={vehicles}
            />
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Скасувати
              </Button>
              <Button type="submit" disabled={isPending}>
                {isPending ? "Збереження..." : "Зберегти"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
