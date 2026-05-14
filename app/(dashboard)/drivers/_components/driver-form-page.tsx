"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createDriverAction, updateDriverAction } from "@/actions/drivers";
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
import { DRIVER_STATUS_LABELS } from "@/lib/constants";
import type { DriverRow } from "@/lib/data/drivers";
import {
  driverInputSchema,
  type DriverFormInput,
  type DriverInput,
} from "@/lib/validation/driver";

type VehicleOption = { id: string; unit: string; plate: string };

type DriverFormPageProps = (
  | { mode: "create" }
  | { mode: "edit"; driver: DriverRow }
) & {
  vehicleOptions: VehicleOption[];
};

export function DriverFormPage(props: DriverFormPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const driver = props.mode === "edit" ? props.driver : undefined;

  const form = useForm<DriverFormInput, unknown, DriverInput>({
    resolver: zodResolver(driverInputSchema),
    defaultValues: {
      full_name: driver?.full_name ?? "",
      phone: driver?.phone ?? "",
      current_vehicle_id: driver?.current_vehicle_id ?? "none",
      status: driver?.status ?? "available",
      rating: driver?.rating ?? undefined,
      commission_per_km_uah: driver?.commission_per_km_uah ?? 0,
      notes: driver?.notes ?? "",
    },
  });

  const onSubmit = (values: DriverInput) => {
    startTransition(async () => {
      const result =
        props.mode === "create"
          ? await createDriverAction(values)
          : await updateDriverAction(props.driver.id, values);

      if (result.ok) {
        toast.success(
          props.mode === "create" ? "Водія додано" : "Дані оновлено",
        );
        router.push("/drivers");
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
        <div className="grid gap-3 sm:grid-cols-[1.6fr_1fr]">
          <FormField
            control={form.control}
            name="full_name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ПІБ</FormLabel>
                <FormControl>
                  <Input placeholder="Іван Мельник" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="phone"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Телефон</FormLabel>
                <FormControl>
                  <Input
                    type="tel"
                    inputMode="tel"
                    placeholder="+380..."
                    {...field}
                    value={field.value ?? ""}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="current_vehicle_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Закріплене авто</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  value={field.value ?? "none"}
                >
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Не закріплено" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="none">Не закріплено</SelectItem>
                    {props.vehicleOptions.map((v) => (
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
          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Статус</FormLabel>
                <Select onValueChange={field.onChange} value={field.value}>
                  <FormControl>
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {Object.entries(DRIVER_STATUS_LABELS).map(([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
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
            name="rating"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Рейтинг 0–5</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="4.5"
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
        </div>
        <FormField
          control={form.control}
          name="commission_per_km_uah"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Комісія, ₴/км</FormLabel>
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
            <Link href="/drivers">Скасувати</Link>
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
