import { PageHeader } from "@/components/crm/page-header";
import { suggestNextClientCode } from "@/lib/data/clients";

import { ClientFormPage } from "../_components/client-form-page";

export const dynamic = "force-dynamic";

export default async function NewClientPage() {
  const nextCode = await suggestNextClientCode();

  return (
    <>
      <PageHeader title="Новий клієнт" backHref="/clients" backLabel="До бази" />
      <ClientFormPage mode="create" defaultCode={nextCode} />
    </>
  );
}
