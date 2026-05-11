"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Pencil, Plus } from "lucide-react";
import { useState, useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createRouteAction, updateRouteAction } from "@/actions/routes";
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
import { ROUTE_STATUS_LABELS } from "@/lib/constants";
import type { RouteRow } from "@/lib/data/routes";
import {
  routeInputSchema,
  type RouteFormInput,
  type RouteInput,
} from "@/lib/validation/route";

type RouteFormDialogProps = {
  mode: "create" | "edit";
  route?: RouteRow;
};

export function RouteFormDialog({ mode, route }: RouteFormDialogProps) {
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<RouteFormInput, unknown, RouteInput>({
    resolver: zodResolver(routeInputSchema),
    defaultValues: {
      name: route?.name ?? "",
      point_a: route?.point_a ?? "",
      point_b: route?.point_b ?? "",
      distance_km: route?.distance_km ?? ("" as unknown as number),
      typical_duration_hours: route?.typical_duration_hours ?? undefined,
      status: route?.status ?? "active",
      notes: route?.notes ?? "",
    },
  });

  const onSubmit = (values: RouteInput) => {
    startTransition(async () => {
      const result =
        mode === "create"
          ? await createRouteAction(values)
          : await updateRouteAction(route!.id, values);

      if (result.ok) {
        toast.success(mode === "create" ? "Маршрут створено" : "Маршрут оновлено");
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
            Новий маршрут
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "Новий маршрут" : "Редагувати маршрут"}
          </DialogTitle>
          <DialogDescription>
            Внесіть дані маршруту: точки A та B, відстань і статус.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Назва</FormLabel>
                  <FormControl>
                    <Input placeholder="Київ → Львів" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="point_a"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Точка А</FormLabel>
                    <FormControl>
                      <Input placeholder="Київ" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="point_b"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Точка Б</FormLabel>
                    <FormControl>
                      <Input placeholder="Львів" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              <FormField
                control={form.control}
                name="distance_km"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Відстань, км</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="540"
                        name={field.name}
                        ref={field.ref}
                        onBlur={field.onBlur}
                        onChange={field.onChange}
                        value={field.value as number | string | undefined ?? ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="typical_duration_hours"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Час, год</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        placeholder="8"
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
                      {Object.entries(ROUTE_STATUS_LABELS).map(([value, label]) => (
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
