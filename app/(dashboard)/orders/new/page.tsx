import Stack from "@mui/material/Stack";
import Alert from "@mui/material/Alert";

import { PageHeader } from "@/components/crm/page-header";
import { listActiveClients } from "@/lib/data/clients";
import { listDriversForSelect } from "@/lib/data/drivers";
import { suggestNextOrderNumber } from "@/lib/data/orders";
import { listAvailableVehicles } from "@/lib/data/vehicles";

import { OrderFormPage } from "../_components/order-form-page";

export const dynamic = "force-dynamic";

export default async function NewOrderPage() {
  const [clients, drivers, vehicles, defaultNumber] = await Promise.all([
    listActiveClients(),
    listDriversForSelect(),
    listAvailableVehicles(),
    suggestNextOrderNumber(),
  ]);

  return (
    <Stack spacing={3}>
      <PageHeader title="Нове замовлення" backHref="/orders" backLabel="До журналу" />

      {clients.length === 0 ? (
        <Alert severity="warning">
          Спочатку додайте принаймні одного клієнта на сторінці «Клієнти».
        </Alert>
      ) : (
        <OrderFormPage
          mode="create"
          defaultNumber={defaultNumber}
          clients={clients}
          drivers={drivers}
          vehicles={vehicles}
        />
      )}
    </Stack>
  );
}
