import { ModulePage } from "@/components/crm/module-page";
import { listRoutes } from "@/lib/data/routes";

import { RouteFormDialog } from "./_components/route-form-dialog";
import { RoutesTable } from "./_components/routes-table";

export const dynamic = "force-dynamic";

export default async function RoutesPage() {
  const rows = await listRoutes();

  return (
    <ModulePage
      eyebrow="Довідник · Маршрути"
      title="Маршрути перевезень"
      description="Закріплені точки А → Б, орієнтовний кілометраж та час. Використовуються для прив'язки до замовлень."
      actions={<RouteFormDialog mode="create" />}
    >
      <RoutesTable rows={rows} />
    </ModulePage>
  );
}
