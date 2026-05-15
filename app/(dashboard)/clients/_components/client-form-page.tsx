"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useTransition } from "react";
import { Controller, useForm } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { createClientAction, updateClientAction } from "@/actions/clients";
import { LinkBehavior } from "@/components/crm/link-behavior";
import { CLIENT_STATUS_LABELS } from "@/lib/constants";
import type { ClientRow } from "@/lib/data/clients";
import { toast } from "@/lib/toast";
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

  const {
    control,
    handleSubmit,
  } = useForm<ClientFormInput, unknown, ClientInput>({
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
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 3 }}
        >
          {/* Row 1: code + name */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              control={control}
              name="code"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Код"
                  placeholder="CL-001"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  sx={{ width: { sm: 140 }, flexShrink: 0 }}
                />
              )}
            />
            <Controller
              control={control}
              name="name"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Назва"
                  placeholder="ТОВ «Агроінвест»"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  sx={{ flexGrow: 1 }}
                />
              )}
            />
          </Stack>

          {/* Row 2: contact_person + phone */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              control={control}
              name="contact_person"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="Контактна особа"
                  placeholder="ПІБ"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name="phone"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="Телефон"
                  placeholder="+380..."
                  type="tel"
                  inputProps={{ inputMode: "tel" }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </Stack>

          {/* Row 3: email + status */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              control={control}
              name="email"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="Email"
                  placeholder="ops@company.ua"
                  type="email"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name="status"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Статус"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  SelectProps={{ MenuProps: { disableScrollLock: true } }}
                >
                  {Object.entries(CLIENT_STATUS_LABELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>

          {/* Row 4: notes */}
          <Controller
            control={control}
            name="notes"
            render={({ field, fieldState }) => (
              <TextField
                {...field}
                value={field.value ?? ""}
                label="Примітки"
                multiline
                rows={4}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
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
              mt: 1,
            }}
          >
            <Button
              component={LinkBehavior}
              href="/clients"
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
