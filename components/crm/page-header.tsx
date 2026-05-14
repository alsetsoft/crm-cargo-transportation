import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import type { ReactNode } from "react";

import { Button } from "@/components/ui/button";

type PageHeaderProps = {
  title: string;
  backHref: string;
  backLabel?: string;
  actions?: ReactNode;
};

export function PageHeader({
  title,
  backHref,
  backLabel = "Назад",
  actions,
}: PageHeaderProps) {
  return (
    <section className="flex flex-wrap items-center justify-between gap-3">
      <h1 className="text-xl font-semibold tracking-tight sm:text-2xl">
        {title}
      </h1>
      <div className="flex flex-wrap items-center gap-2">
        {actions}
        <Button variant="outline" size="sm" asChild>
          <Link href={backHref}>
            <ArrowLeft className="size-4" />
            {backLabel}
          </Link>
        </Button>
      </div>
    </section>
  );
}
