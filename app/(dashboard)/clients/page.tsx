import { ModulePage } from "@/components/crm/module-page";
import { listClients, suggestNextClientCode } from "@/lib/data/clients";

import { ClientFormDialog } from "./_components/client-form-dialog";
import { ClientsTable } from "./_components/clients-table";

export const dynamic = "force-dynamic";

export default async function ClientsPage() {
  const [rows, nextCode] = await Promise.all([
    listClients(),
    suggestNextClientCode(),
  ]);

  return (
    <ModulePage
      eyebrow="Довідник · Клієнти"
      title="База клієнтів"
      description="Контрагенти-замовники з контактами, оборотом та контролем заборгованості."
      actions={<ClientFormDialog mode="create" defaultCode={nextCode} />}
    >
      <ClientsTable rows={rows} />
    </ModulePage>
  );
}
