import MuiButton from "@mui/material/Button";
import { Plus } from "lucide-react";

import { ModulePage } from "@/components/crm/module-page";
import { listClients } from "@/lib/data/clients";

import { ClientsTable } from "./_components/clients-table";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const rows = await listClients();

  return (
    <ModulePage
      eyebrow="Довідник · Клієнти"
      title="База клієнтів"
      description="Контрагенти-замовники з контактами, оборотом та контролем заборгованості."
      actions={
        <MuiButton
          href="/clients/new"
          variant="contained"
          size="large"
          startIcon={<Plus size={18} />}
        >
          Новий клієнт
        </MuiButton>
      }
    >
      <ClientsTable rows={rows} />
    </ModulePage>
  );
}
