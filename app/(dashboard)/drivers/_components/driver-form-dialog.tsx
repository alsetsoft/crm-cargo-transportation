"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createDriverAction, updateDriverAction } from "@/actions/drivers";
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
import { DRIVER_STATUS_LABELS } from "@/lib/constants";
import type { DriverRow } from "@/lib/data/drivers";
import {
  driverInputSchema,
  type DriverFormInput,
  type DriverInput,
} from "@/lib/validation/driver";

type VehicleOption = { id: string; unit: string; plate: string };

type DriverFormDialogProps = {
  mode: "create" | "edit";
  driver?: DriverRow;
  vehicleOptions: VehicleOption[];
};

export function DriverFormDialog({
  mode,
  driver,
  vehicleOptions,
}: DriverFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<DriverFormInput, unknown, DriverInput>({
    resolver: zodResolver(driverInputSchema),
    defaultValues: {
      full_name: driver?.full_name ?? "",
      phone: driver?.phone ?? "",
      current_vehicle_id: driver?.current_vehicle_id ?? "none",
      status: driver?.status ?? "available",
      rating: driver?.rating ?? undefined,
      notes: driver?.notes ?? "",
    },
  });

  const onSubmit = (values: DriverInput) => {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createDriverAction(values)
          : await updateDriverAction(driver!.id, values);

      if (result.ok) {
        toast.success(mode === "create" ? "Водія додано" : "Дані оновлено");
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
            Новий водій
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-xl">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Новий водій" : "Редагувати водія"}
          </DialogTitle>
          <DialogDescription>
            Картка водія з прив&apos;язкою до авто та поточним статусом.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                      <Input placeholder="+380..." {...field} value={field.value ?? ""} />
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
                        <SelectTrigger>
                          <SelectValue placeholder="Не закріплено" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="none">Не закріплено</SelectItem>
                        {vehicleOptions.map((v) => (
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
                        <SelectTrigger>
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
                        type="number"
                        step="0.1"
                        min="0"
                        max="5"
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
