"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import { createClientAction, updateClientAction } from "@/actions/clients";
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
import { CLIENT_STATUS_LABELS } from "@/lib/constants";
import type { ClientRow } from "@/lib/data/clients";
import {
  clientInputSchema,
  type ClientFormInput,
  type ClientInput,
} from "@/lib/validation/client";

type ClientFormPageProps =
  | { mode: "create"; defaultCode?: string }
  | { mode: "edit"; client: ClientRow };

export function ClientFormPage(props: ClientFormPageProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const client = props.mode === "edit" ? props.client : undefined;
  const defaultCode = props.mode === "create" ? props.defaultCode : undefined;

  const form = useForm<ClientFormInput, unknown, ClientInput>({
    resolver: zodResolver(clientInputSchema),
    defaultValues: {
      code: client?.code ?? defaultCode ?? "",
      name: client?.name ?? "",
      contact_person: client?.contact_person ?? "",
      phone: client?.phone ?? "",
      email: client?.email ?? "",
      status: client?.status ?? "active",
      notes: client?.notes ?? "",
    },
  });

  const onSubmit = (values: ClientInput) => {
    startTransition(async () => {
      const result =
        props.mode === "create"
          ? await createClientAction(values)
          : await updateClientAction(props.client.id, values);

      if (result.ok) {
        toast.success(
          props.mode === "create" ? "Клієнта створено" : "Клієнта оновлено",
        );
        router.push("/clients");
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
        <div className="grid gap-3 sm:grid-cols-[140px_1fr]">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Код</FormLabel>
                <FormControl>
                  <Input placeholder="CL-001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Назва</FormLabel>
                <FormControl>
                  <Input placeholder="ТОВ «Агроінвест»" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="contact_person"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Контактна особа</FormLabel>
                <FormControl>
                  <Input placeholder="ПІБ" {...field} value={field.value ?? ""} />
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
        <div className="grid gap-3 sm:grid-cols-2">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="ops@company.ua"
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
                    {Object.entries(CLIENT_STATUS_LABELS).map(([value, label]) => (
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
            <Link href="/clients">Скасувати</Link>
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
