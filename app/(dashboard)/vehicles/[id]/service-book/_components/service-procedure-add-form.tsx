"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { Plus, X } from "lucide-react";
import { useEffect, useState, useTransition } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";

import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import IconButton from "@mui/material/IconButton";
import MenuItem from "@mui/material/MenuItem";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";

import { createServiceProcedureAction } from "@/actions/service-procedures";
import { VEHICLE_DOCUMENT_TYPE_LABELS } from "@/lib/constants";
import { toast } from "@/lib/toast";
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

  const { control, handleSubmit, reset, setValue } = useForm<
    ServiceProcedureFormInput,
    unknown,
    ServiceProcedureInput
  >({
    resolver: zodResolver(serviceProcedureInputSchema),
    defaultValues: {
      type: "technical_inspection",
      period_km: undefined,
      period_days: undefined,
      insurance_start_date: "",
      insurance_end_date: "",
      notes: "",
    },
  });

  // Insurance ("Страховка") is a calendar event — use start/end dates
  // instead of period-based scheduling. For all other types we keep the
  // period_km / period_days inputs.
  const currentType = useWatch({ control, name: "type" });
  const isInsurance = currentType === "insurance";
  useEffect(() => {
    if (isInsurance) {
      setValue("period_km", undefined, { shouldValidate: true });
      setValue("period_days", undefined, { shouldValidate: true });
    } else {
      setValue("insurance_start_date", "", { shouldValidate: true });
      setValue("insurance_end_date", "", { shouldValidate: true });
    }
  }, [isInsurance, setValue]);

  const onSubmit = (values: ServiceProcedureInput) => {
    startTransition(async () => {
      const result = await createServiceProcedureAction(vehicleId, values);
      if (result.ok) {
        toast.success("Процедуру додано");
        reset();
        setOpen(false);
      } else {
        toast.error(result.error);
      }
    });
  };

  if (!open) {
    return (
      <Box>
        <Button
          variant="contained"
          startIcon={<Plus size={18} />}
          onClick={() => setOpen(true)}
        >
          Додати процедуру
        </Button>
      </Box>
    );
  }

  return (
    <Card variant="outlined">
      <CardContent>
        <Box
          component="form"
          onSubmit={handleSubmit(onSubmit)}
        >
          <Stack
            direction={{ xs: "column", sm: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", sm: "center" }}
          >
            {/* Procedure type */}
            <Controller
              control={control}
              name="type"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  select
                  label="Процедура"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                  sx={{ minWidth: { sm: 200 } }}
                  SelectProps={{ MenuProps: { disableScrollLock: true } }}
                >
                  {Object.entries(VEHICLE_DOCUMENT_TYPE_LABELS).map(
                    ([value, label]) => (
                      <MenuItem key={value} value={value}>
                        {label}
                      </MenuItem>
                    ),
                  )}
                </TextField>
              )}
            />

            {/* Insurance uses explicit start/end dates; other types use periodic km/days. */}
            {isInsurance ? (
              <>
                <Controller
                  control={control}
                  name="insurance_start_date"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ""}
                      type="date"
                      label="Дата страхування"
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      sx={{ maxWidth: { sm: 180 } }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="insurance_end_date"
                  render={({ field, fieldState }) => (
                    <TextField
                      {...field}
                      value={field.value ?? ""}
                      type="date"
                      label="Дата закінчення"
                      InputLabelProps={{ shrink: true }}
                      error={!!fieldState.error}
                      helperText={fieldState.error?.message}
                      fullWidth
                      sx={{ maxWidth: { sm: 180 } }}
                    />
                  )}
                />
              </>
            ) : (
              <>
                <Controller
                  control={control}
                  name="period_km"
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Період, км"
                      placeholder="10000"
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
                      sx={{ maxWidth: { sm: 140 } }}
                    />
                  )}
                />
                <Controller
                  control={control}
                  name="period_days"
                  render={({ field, fieldState }) => (
                    <TextField
                      label="Період, днів"
                      placeholder="365"
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
                      sx={{ maxWidth: { sm: 140 } }}
                    />
                  )}
                />
              </>
            )}

            {/* Notes */}
            <Controller
              control={control}
              name="notes"
              render={({ field, fieldState }) => (
                <TextField
                  {...field}
                  value={field.value ?? ""}
                  label="Примітки"
                  placeholder="Опціонально"
                  error={!!fieldState.error}
                  helperText={fieldState.error?.message}
                  fullWidth
                />
              )}
            />

            {/* Submit + cancel */}
            <Stack
              direction="row"
              spacing={1}
            >
              <Button
                type="submit"
                variant="contained"
                size="medium"
                disabled={isPending}
              >
                {isPending ? "..." : "Додати"}
              </Button>
              <IconButton
                aria-label="Закрити"
                onClick={() => {
                  reset();
                  setOpen(false);
                }}
                disabled={isPending}
              >
                <X size={18} />
              </IconButton>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
}
