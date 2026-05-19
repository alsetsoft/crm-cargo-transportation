import { ModulePage } from "@/components/crm/module-page";
import { listGpsFleet } from "@/lib/data/gps";

import { GpsTable } from "./_components/gps-table";

export const dynamic = "force-dynamic";

export default async function GpsPage() {
  const { configured, rows } = await listGpsFleet();

  return (
    <ModulePage
      eyebrow="Автопарк · GPS"
      title="GPS трекінг"
      description="Онлайн-моніторинг геопозиції та стану автопарку через інтеграцію DozoR."
    >
      <GpsTable rows={rows} configured={configured} />
    </ModulePage>
  );
}
