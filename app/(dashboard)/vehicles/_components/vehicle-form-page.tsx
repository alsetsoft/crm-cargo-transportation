"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createVehicleAction, updateVehicleAction } from "@/actions/vehicles";
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
import { VEHICLE_STATUS_LABELS } from "@/lib/constants";
import type { VehicleRow } from "@/lib/data/vehicles";
import {
  vehicleInputSchema,
  type VehicleFormInput,
  type VehicleInput,
} from "@/lib/validation/vehicle";

type DriverOption = { id: string; full_name: string };

type VehicleFormPageProps = (
  | { mode: "create" }
  | { mode: "edit"; vehicle: VehicleRow }
) & {
  driverOptions: DriverOption[];
};

export function VehicleFormPage(props: VehicleFormPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const vehicle = props.mode === "edit" ? props.vehicle : undefined;

  const form = useForm<VehicleFormInput, unknown, VehicleInput>({
    resolver: zodResolver(vehicleInputSchema),
    defaultValues: {
      unit: vehicle?.unit ?? "",
      plate: vehicle?.plate ?? "",
      current_driver_id: vehicle?.current_driver_id ?? "none",
      fuel_norm_l_100km: vehicle?.fuel_norm_l_100km ?? undefined,
      status: vehicle?.status ?? "available",
      service_next_date: vehicle?.service_next_date ?? "",
      service_next_odometer: vehicle?.service_next_odometer ?? undefined,
      notes: vehicle?.notes ?? "",
    },
  });

  const onSubmit = (values: VehicleInput) => {
    startTransition(async () => {
      const result =
        props.mode === "create"
          ? await createVehicleAction(values)
          : await updateVehicleAction(props.vehicle.id, values);

      if (result.ok) {
        toast.success(props.mode === "create" ? "Авто додано" : "Дані оновлено");
        router.push("/vehicles");
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
        <div className="grid gap-3 sm:grid-cols-[1.4fr_0.8fr]">
          <FormField
            control={form.control}
            name="unit"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Марка / модель</FormLabel>
                <FormControl>
                  <Input placeholder="DAF XF 480" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="plate"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Держномер</FormLabel>
                <FormControl>
                  <Input placeholder="AA 1234 BB" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="current_driver_id"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Закріплений водій</FormLabel>
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
                    {props.driverOptions.map((d) => (
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
                    {Object.entries(VEHICLE_STATUS_LABELS).map(([value, label]) => (
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
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          <FormField
            control={form.control}
            name="fuel_norm_l_100km"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Розхід, л/100км</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="decimal"
                    placeholder="32"
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
            name="service_next_date"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Наступне ТО</FormLabel>
                <FormControl>
                  <Input type="date" {...field} value={field.value ?? ""} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="service_next_odometer"
            render={({ field }) => (
              <FormItem>
                <FormLabel>ТО на пробігу, км</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    inputMode="numeric"
                    placeholder="150000"
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
            <Link href="/vehicles">Скасувати</Link>
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
