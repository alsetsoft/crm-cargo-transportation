"use client";

import { useRouter } from "next/navigation";
import { useTransition } from "react";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Stack from "@mui/material/Stack";

import { createOrderAction, updateOrderAction } from "@/actions/orders";
import { LinkBehavior } from "@/components/crm/link-behavior";
import type { OrderExpenseRow, OrderRow } from "@/lib/data/orders";
import { toast } from "@/lib/toast";
import type { OrderInput } from "@/lib/validation/order";

import {
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
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={form.handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 0 }}
        >
          <OrderFormBody
            form={form}
            expensesField={expensesField}
            preview={preview}
            clients={props.clients}
            drivers={props.drivers}
            vehicles={props.vehicles}
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
              mt: 3,
            }}
          >
            <Button
              component={LinkBehavior}
              href="/orders"
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
