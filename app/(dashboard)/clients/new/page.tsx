import { ArrowLeft } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { suggestNextClientCode } from "@/lib/data/clients";

import { ClientFormPage } from "../_components/client-form-page";

export const dynamic = "force-dynamic";

export default async function NewClientPage() {
  const nextCode = await suggestNextClientCode();

  return (
    <>
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">Довідник · Клієнти</Badge>
          <div className="space-y-2">
            <h1 className="text-2xl font-semibold tracking-tight sm:text-3xl lg:text-4xl">
              Новий клієнт
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              Реєстрація контрагента-замовника з контактною та фінансовою
              інформацією.
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

      <ClientFormPage mode="create" defaultCode={nextCode} />
    </>
  );
}
