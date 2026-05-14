import { Plus } from "lucide-react";
import Link from "next/link";

import { ModulePage } from "@/components/crm/module-page";
import { Button } from "@/components/ui/button";
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
        <Button asChild>
          <Link href="/clients/new">
            <Plus className="size-4" />
            Новий клієнт
          </Link>
        </Button>
      }
    >
      <ClientsTable rows={rows} />
    </ModulePage>
  );
}
