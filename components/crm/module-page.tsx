import type { ReactNode } from "react";

import { Badge } from "@/components/ui/badge";

type ModulePageProps = {
  eyebrow: string;
  title: string;
  description: string;
  actions?: ReactNode;
  children: ReactNode;
};

export function ModulePage({
  eyebrow,
  title,
  description,
  actions,
  children,
}: ModulePageProps) {
  return (
    <>
      <section className="page-hero">
        <div className="max-w-3xl space-y-3">
          <Badge variant="secondary">{eyebrow}</Badge>
          <div className="space-y-2">
            <h1 className="text-3xl font-semibold tracking-tight sm:text-4xl">
              {title}
            </h1>
            <p className="text-sm text-muted-foreground sm:text-base">
              {description}
            </p>
          </div>
        </div>
        {actions && (
          <div className="flex flex-wrap gap-2 sm:gap-3 lg:justify-end">
            {actions}
          </div>
        )}
      </section>
      {children}
    </>
  );
}
