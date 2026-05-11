"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createOrderAction, updateOrderAction } from "@/actions/orders";
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
  ScrollArea,
} from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  ORDER_STATUS_LABELS,
  PAYMENT_FORM_LABELS,
  PAYMENT_STATUS_LABELS,
} from "@/lib/constants";
import type { OrderRow } from "@/lib/data/orders";
import {
  orderInputSchema,
  type OrderFormInput,
  type OrderInput,
} from "@/lib/validation/order";

type ClientOption = { id: string; name: string; code: string };
type RouteOption = { id: string; name: string };
type DriverOption = { id: string; full_name: string };
type VehicleOption = { id: string; unit: string; plate: string };

type OrderFormDialogProps = {
  mode: "create" | "edit";
  order?: OrderRow;
  defaultNumber?: string;
  clients: ClientOption[];
  routes: RouteOption[];
  drivers: DriverOption[];
  vehicles: VehicleOption[];
};

export function OrderFormDialog({
  mode,
  order,
  defaultNumber,
  clients,
  routes,
  drivers,
  vehicles,
}: OrderFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<OrderFormInput, unknown, OrderInput>({
    resolver: zodResolver(orderInputSchema),
    defaultValues: {
      number: order?.number ?? defaultNumber ?? "",
      client_id: order?.client_id ?? "",
      route_id: order?.route_id ?? "none",
      driver_id: order?.driver_id ?? "none",
      vehicle_id: order?.vehicle_id ?? "none",
      volume_tons: order?.volume_tons ?? undefined,
      price_uah: order?.price_uah ?? ("" as unknown as number),
      km_salary: order?.km_salary ?? undefined,
      km_invoice: order?.km_invoice ?? undefined,
      payment_form: order?.payment_form ?? "bank_transfer",
      payment_status: order?.payment_status ?? "unpaid",
      refuels_count: order?.refuels_count ?? 0,
      odometer_start: order?.odometer_start ?? undefined,
      odometer_end: order?.odometer_end ?? undefined,
      fuel_cost_uah: order?.fuel_cost_uah ?? 0,
      actual_profit_uah: order?.actual_profit_uah ?? undefined,
      status: order?.status ?? "new",
      notes: order?.notes ?? "",
    },
  });

  const onSubmit = (values: OrderInput) => {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createOrderAction(values)
          : await updateOrderAction(order!.id, values);

      if (result.ok) {
        toast.success(mode === "create" ? "Замовлення створено" : "Замовлення оновлено");
        setOpen(false);
        form.reset();
      } else {
        toast.error(result.error);
      }
    });
  };

  const hasClients = clients.length > 0;

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value);
        if (!value) form.reset();
      }}
    >
      <DialogTrigger asChild>
        {mode === "edit" ? (
          <Button variant="ghost" size="icon-sm" aria-label="Редагувати">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button disabled={!hasClients}>
            <Plus className="size-4" />
            Нове замовлення
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Нове замовлення" : "Редагувати замовлення"}
          </DialogTitle>
          <DialogDescription>
            Прив&apos;язка до клієнта, маршруту, водія та авто + фінансові показники рейсу.
          </DialogDescription>
        </DialogHeader>
        {!hasClients ? (
          <p className="rounded-xl border border-dashed border-warning/40 bg-warning/10 p-4 text-sm text-warning-foreground">
            Спочатку додайте принаймні одного клієнта на сторінці «Клієнти».
          </p>
        ) : (
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <ScrollArea className="max-h-[calc(100dvh-12rem)] pr-3 sm:max-h-[70vh]">
                <div className="space-y-4">
                  <div className="grid gap-3 sm:grid-cols-[140px_1fr_180px]">
                    <FormField
                      control={form.control}
                      name="number"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>№</FormLabel>
                          <FormControl>
                            <Input placeholder="1024" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="client_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Замовник</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Оберіть клієнта" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {clients.map((c) => (
                                <SelectItem key={c.id} value={c.id}>
                                  {c.code} · {c.name}
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
                      name="status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Статус</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(ORDER_STATUS_LABELS).map(([v, l]) => (
                                <SelectItem key={v} value={v}>
                                  {l}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-3">
                    <FormField
                      control={form.control}
                      name="route_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Маршрут</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value ?? "none"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Без маршруту" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Без маршруту</SelectItem>
                              {routes.map((r) => (
                                <SelectItem key={r.id} value={r.id}>
                                  {r.name}
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
                      name="driver_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Водій</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value ?? "none"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Не призначено" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Не призначено</SelectItem>
                              {drivers.map((d) => (
                                <SelectItem key={d.id} value={d.id}>
                                  {d.full_name}
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
                      name="vehicle_id"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Авто</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value ?? "none"}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Не призначено" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="none">Не призначено</SelectItem>
                              {vehicles.map((v) => (
                                <SelectItem key={v.id} value={v.id}>
                                  {v.plate} · {v.unit}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    <NumberFormField name="volume_tons" label="Об'єм, т" step="0.1" form={form} />
                    <NumberFormField name="price_uah" label="Ціна, ₴" step="0.01" form={form} />
                    <NumberFormField name="km_salary" label="км/зп" step="0.1" form={form} />
                    <NumberFormField name="km_invoice" label="км/рах" step="0.1" form={form} />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <FormField
                      control={form.control}
                      name="payment_form"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Форма оплати</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(PAYMENT_FORM_LABELS).map(([v, l]) => (
                                <SelectItem key={v} value={v}>
                                  {l}
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
                      name="payment_status"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Статус оплати</FormLabel>
                          <Select onValueChange={field.onChange} value={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {Object.entries(PAYMENT_STATUS_LABELS).map(([v, l]) => (
                                <SelectItem key={v} value={v}>
                                  {l}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-4">
                    <NumberFormField name="refuels_count" label="Заправки" step="1" form={form} />
                    <NumberFormField name="odometer_start" label="ОДО старт" step="1" form={form} />
                    <NumberFormField name="odometer_end" label="ОДО кінець" step="1" form={form} />
                    <NumberFormField name="fuel_cost_uah" label="Вартість ДП, ₴" step="0.01" form={form} />
                  </div>

                  <div className="grid gap-3 sm:grid-cols-2">
                    <NumberFormField
                      name="actual_profit_uah"
                      label="Чистий прибуток, ₴"
                      step="0.01"
                      form={form}
                    />
                    <div className="rounded-xl bg-surface p-3 text-xs text-muted-foreground">
                      Рентабельність розраховується автоматично як
                      <br />
                      <code>actual_profit / price × 100</code>
                    </div>
                  </div>

                  <FormField
                    control={form.control}
                    name="notes"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Примітки</FormLabel>
                        <FormControl>
                          <Textarea rows={2} {...field} value={field.value ?? ""} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </ScrollArea>
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
                  {isPending ? "Збереження..." : mode === "create" ? "Створити" : "Зберегти"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
}

type NumberFormFieldProps = {
  name: keyof OrderFormInput;
  label: string;
  step: string;
  form: ReturnType<typeof useForm<OrderFormInput, unknown, OrderInput>>;
};

function NumberFormField({ name, label, step, form }: NumberFormFieldProps) {
  const isInteger = step === "1";
  return (
    <FormField
      control={form.control}
      name={name}
      render={({ field }) => (
        <FormItem>
          <FormLabel>{label}</FormLabel>
          <FormControl>
            <Input
              type="number"
              step={step}
              inputMode={isInteger ? "numeric" : "decimal"}
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
  );
}
