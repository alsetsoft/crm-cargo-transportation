import MuiButton from "@mui/material/Button";
import { Plus } from "lucide-react";

import { ModulePage } from "@/components/crm/module-page";
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
        <MuiButton
          href="/drivers/new"
          variant="contained"
          size="large"
          startIcon={<Plus size={18} />}
        >
          Новий водій
        </MuiButton>
      }
    >
      <DriversTable rows={rows} />
    </ModulePage>
  );
}
