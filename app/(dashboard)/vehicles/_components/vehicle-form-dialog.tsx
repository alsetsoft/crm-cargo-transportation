"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createVehicleAction, updateVehicleAction } from "@/actions/vehicles";
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

type VehicleFormDialogProps = {
  mode: "create" | "edit";
  vehicle?: VehicleRow;
  driverOptions: DriverOption[];
};

export function VehicleFormDialog({
  mode,
  vehicle,
  driverOptions,
}: VehicleFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

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
        mode === "create"
          ? await createVehicleAction(values)
          : await updateVehicleAction(vehicle!.id, values);

      if (result.ok) {
        toast.success(mode === "create" ? "Авто додано" : "Дані оновлено");
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
        {mode === "edit" ? (
          <Button variant="ghost" size="icon-sm" aria-label="Редагувати">
            <Pencil className="size-4" />
          </Button>
        ) : (
          <Button>
            <Plus className="size-4" />
            Нове авто
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Нове авто" : "Редагувати авто"}
          </DialogTitle>
          <DialogDescription>
            Технічна картка ТЗ з нормативом розходу та сервісною книгою.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                        <SelectTrigger>
                          <SelectValue placeholder="Не закріплено" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Не закріплено</SelectItem>
                        {driverOptions.map((d) => (
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
                        <SelectTrigger>
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
                        type="number"
                        step="0.1"
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
                      <Input
                        type="date"
                        {...field}
                        value={field.value ?? ""}
                      />
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
                        type="number"
                        step="1"
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
                    <Textarea rows={2} {...field} value={field.value ?? ""} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
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
                {isPending ? "Збереження..." : mode === "create" ? "Створити" : "Зберегти"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
