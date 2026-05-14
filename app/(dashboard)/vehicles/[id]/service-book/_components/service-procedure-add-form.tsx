"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createServiceProcedureAction } from "@/actions/service-procedures";
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
import { VEHICLE_DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import {
  serviceProcedureInputSchema,
  type ServiceProcedureFormInput,
  type ServiceProcedureInput,
} from "@/lib/validation/service-procedure";

type ServiceProcedureAddFormProps = {
  vehicleId: string;
};

export function ServiceProcedureAddForm({
  vehicleId,
}: ServiceProcedureAddFormProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<ServiceProcedureFormInput, unknown, ServiceProcedureInput>(
    {
      resolver: zodResolver(serviceProcedureInputSchema),
      defaultValues: {
        type: "technical_inspection",
        period_km: undefined,
        period_days: undefined,
        notes: "",
      },
    },
  );

  const onSubmit = (values: ServiceProcedureInput) => {
    startTransition(async () => {
      const result = await createServiceProcedureAction(vehicleId, values);
      if (result.ok) {
        toast.success("Процедуру додано");
        form.reset();
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  if (!open) {
    return (
      <Button onClick={() => setOpen(true)}>
        <Plus className="size-4" />
        Додати процедуру
      </Button>
    );
  }

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="panel-card grid w-full gap-3 p-4 sm:grid-cols-[1.4fr_1fr_1fr_1fr_auto] sm:items-end"
      >
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Процедура</FormLabel>
              <Select onValueChange={field.onChange} value={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full">
                    <SelectValue />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {Object.entries(VEHICLE_DOCUMENT_TYPE_LABELS).map(
                    ([value, label]) => (
                      <SelectItem key={value} value={value}>
                        {label}
                      </SelectItem>
                    ),
                  )}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="period_km"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Період, км</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="10000"
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
          name="period_days"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Період, днів</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  inputMode="numeric"
                  placeholder="365"
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
                <Textarea
                  rows={1}
                  placeholder="Опціонально"
                  {...field}
                  value={field.value ?? ""}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex gap-1">
          <Button type="submit" disabled={isPending}>
            {isPending ? "..." : "Додати"}
          </Button>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            aria-label="Закрити"
            onClick={() => {
              form.reset();
              setOpen(false);
            }}
            disabled={isPending}
          >
            <X className="size-4" />
          </Button>
        </div>
      </form>
    </Form>
  );
}
