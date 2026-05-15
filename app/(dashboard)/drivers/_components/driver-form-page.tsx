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

import { createDriverAction, updateDriverAction } from "@/actions/drivers";
import { LinkBehavior } from "@/components/crm/link-behavior";
import { DRIVER_STATUS_LABELS } from "@/lib/constants";
import type { DriverRow } from "@/lib/data/drivers";
import { toast } from "@/lib/toast";
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

  const { control, handleSubmit } = useForm<DriverFormInput, unknown, DriverInput>({
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
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 3 }}
        >
          {/* Row 1: full_name + phone */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              control={control}
              name="full_name"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="ПІБ"
                  placeholder="Іван Мельник"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  sx={{ flexGrow: 1 }}
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
                  sx={{ width: { sm: 200 }, flexShrink: 0 }}
                />
              )}
            />
          </Stack>

          {/* Row 2: current_vehicle_id + status + rating */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              control={control}
              name="current_vehicle_id"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? "none"}
                  select
                  label="Закріплене авто"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  sx={{ flexGrow: { sm: 2 } }}
                  SelectProps={{ MenuProps: { disableScrollLock: true } }}
                >
                  <MenuItem value="none">Не закріплено</MenuItem>
                  {props.vehicleOptions.map((v) => (
                    <MenuItem key={v.id} value={v.id}>
                      {v.plate} · {v.unit}
                    </MenuItem>
                  ))}
                </TextField>
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
                  {Object.entries(DRIVER_STATUS_LABELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
            <Controller
              control={control}
              name="rating"
              render={({ field, fieldState }) => (
                <TextField
                  label="Рейтинг 0–5"
                  placeholder="4.5"
                  type="text"
                  inputProps={{ inputMode: "decimal" }}
                  name={field.name}
                  inputRef={field.ref}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={(field.value as number | string | undefined) ?? ""}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
          </Stack>

          {/* Row 3: commission_per_km_uah */}
          <Controller
            control={control}
            name="commission_per_km_uah"
            render={({ field, fieldState }) => (
              <TextField
                label="Комісія, ₴/км"
                placeholder="0"
                type="text"
                inputProps={{ inputMode: "decimal" }}
                name={field.name}
                inputRef={field.ref}
                onBlur={field.onBlur}
                onChange={field.onChange}
                value={(field.value as number | string | undefined) ?? ""}
                error={!!fieldState.error}
                helperText={fieldState.error?.message}
                fullWidth
              />
            )}
          />

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
                rows={3}
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
              href="/drivers"
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
