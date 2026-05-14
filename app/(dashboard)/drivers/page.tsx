import { Plus } from "lucide-react";
import Link from "next/link";

import { ModulePage } from "@/components/crm/module-page";
import { Button } from "@/components/ui/button";
import { listDrivers } from "@/lib/data/drivers";

import { DriversTable } from "./_components/drivers-table";

export const dynamic = "force-dynamic";

export default async function DriversPage() {
  const rows = await listDrivers();

  return (
    <ModulePage
      eyebrow="Автопарк · Водії"
      title="Водії"
      description="Облік водійського складу: статус, прив'язка до авто, рейтинг ефективності."
      actions={
        <Button asChild>
          <Link href="/drivers/new">
            <Plus className="size-4" />
            Новий водій
          </Link>
        </Button>
      }
    >
      <DriversTable rows={rows} />
    </ModulePage>
  );
}
