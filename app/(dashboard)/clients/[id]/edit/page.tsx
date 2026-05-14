import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
    <>
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Довідник · Клієнти</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Редагувати клієнта
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {client.name}
            </p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
          <Button variant="outline" asChild>
            <Link href="/clients">
              <ArrowLeft className="size-4" />
              До бази
            </Link>
          </Button>
        </div>
      </section>

      <ClientFormPage mode="edit" client={client} />
    </>
  );
}
