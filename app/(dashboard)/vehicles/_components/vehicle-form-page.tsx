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

import { createVehicleAction, updateVehicleAction } from "@/actions/vehicles";
import { LinkBehavior } from "@/components/crm/link-behavior";
import { VEHICLE_STATUS_LABELS } from "@/lib/constants";
import type { VehicleRow } from "@/lib/data/vehicles";
import { toast } from "@/lib/toast";
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

  const { control, handleSubmit } = useForm<VehicleFormInput, unknown, VehicleInput>({
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
    <Card>
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
          sx={{ display: "grid", gap: 3 }}
        >
          {/* Row 1: unit + plate */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              control={control}
              name="unit"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Марка / модель"
                  placeholder="DAF XF 480"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  sx={{ flexGrow: 1 }}
                />
              )}
            />
            <Controller
              control={control}
              name="plate"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  label="Держномер"
                  placeholder="AA 1234 BB"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  sx={{ width: { sm: 160 }, flexShrink: 0 }}
                />
              )}
            />
          </Stack>

          {/* Row 2: current_driver_id + status */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              control={control}
              name="current_driver_id"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? "none"}
                  select
                  label="Закріплений водій"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  SelectProps={{ MenuProps: { disableScrollLock: true } }}
                >
                  <MenuItem value="none">Не закріплено</MenuItem>
                  {props.driverOptions.map((d) => (
                    <MenuItem key={d.id} value={d.id}>
                      {d.full_name}
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
                  {Object.entries(VEHICLE_STATUS_LABELS).map(([value, label]) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Stack>

          {/* Row 3: fuel_norm + service_next_date + service_next_odometer */}
          <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
            <Controller
              control={control}
              name="fuel_norm_l_100km"
              render={({ field, fieldState }) => (
                <TextField
                  label="Розхід, л/100км"
                  placeholder="32"
                  type="text"
                  inputProps={{ inputMode: "decimal" }}
                  name={field.name}
                  ref={field.ref}
                  onBlur={field.onBlur}
                  onChange={field.onChange}
                  value={(field.value as number | string | undefined) ?? ""}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name="service_next_date"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="Наступне ТО"
                  type="date"
                  InputLabelProps={{ shrink: true }}
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />
            <Controller
              control={control}
              name="service_next_odometer"
              render={({ field, fieldState }) => (
                <TextField
                  label="ТО на пробігу, км"
                  placeholder="150000"
                  type="text"
                  inputProps={{ inputMode: "numeric" }}
                  name={field.name}
                  ref={field.ref}
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
              href="/vehicles"
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
