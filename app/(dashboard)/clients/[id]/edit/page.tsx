import { notFound } from "next/navigation";

import Stack from "@mui/material/Stack";

import { PageHeader } from "@/components/crm/page-header";
import { getClient } from "@/lib/data/clients";

import { ClientFormPage } from "../../_components/client-form-page";

export const dynamic = "force-dynamic";

type PageProps = { params: Promise<{ id: string }> };

export default async function EditClientPage({ params }: PageProps) {
  const { id } = await params;
  const client = await getClient(id);

  if (!client) {
    notFound();
  }

  return (
    <Stack spacing={3}>
      <PageHeader
        title={`Зміна клієнта · ${client.name}`}
        backHref="/clients"
        backLabel="До бази"
      />
      <ClientFormPage mode="edit" client={client} />
    </Stack>
  );
}
