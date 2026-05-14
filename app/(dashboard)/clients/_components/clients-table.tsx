import { History, Pencil } from "lucide-react";
import Link from "next/link";

import { deleteClientAction } from "@/actions/clients";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { StatusBadge } from "@/components/crm/status-badge";
import { Button } from "@/components/ui/button";
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_TONES,
  type ClientStatus,
} from "@/lib/constants";
import type { ClientWithStats } from "@/lib/data/clients";
import { formatNumber, formatUah } from "@/lib/format";

type ClientsTableProps = {
  rows: ClientWithStats[];
};

export function ClientsTable({ rows }: ClientsTableProps) {
  if (rows.length === 0) {
    return (
      <div className="panel-card flex flex-col items-center gap-2 p-10 text-center">
        <p className="text-base font-medium">Клієнтів ще немає</p>
        <p className="text-sm text-muted-foreground">
          Створіть першого замовника, щоб можна було реєструвати замовлення.
        </p>
      </div>
    );
  }

  return (
    <div className="panel-card overflow-x-auto">
      <table className="data-table">
        <thead>
          <tr>
            <th className="hidden md:table-cell">Код</th>
            <th>Назва</th>
            <th className="hidden md:table-cell">Контактна особа</th>
            <th className="hidden md:table-cell">Телефон</th>
            <th className="hidden md:table-cell">Email</th>
            <th className="hidden text-right md:table-cell">Замовлень</th>
            <th className="hidden text-right md:table-cell">Оборот</th>
            <th>Статус</th>
            <th className="text-right">Дії</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = row.status as ClientStatus | null;
            return (
              <tr key={row.id ?? row.code ?? ""}>
                <td className="hidden font-mono text-muted-foreground md:table-cell">{row.code}</td>
                <td className="font-medium text-foreground">
                  {row.id ? (
                    <Link
                      href={`/clients/${row.id}`}
                      className="hover:underline"
                    >
                      {row.name}
                    </Link>
                  ) : (
                    row.name
                  )}
                  <div className="mt-1 space-y-0.5 text-xs text-muted-foreground md:hidden">
                    <div className="font-mono">{row.code}</div>
                    {row.phone && <div>{row.phone}</div>}
                  </div>
                </td>
                <td className="hidden md:table-cell">{row.contact_person ?? "—"}</td>
                <td className="hidden text-muted-foreground md:table-cell">{row.phone ?? "—"}</td>
                <td className="hidden text-muted-foreground md:table-cell" title={row.email ?? undefined}>
                  {row.email ?? "—"}
                </td>
                <td className="hidden text-right tabular-nums md:table-cell">{formatNumber(row.orders_count)}</td>
                <td className="hidden text-right tabular-nums md:table-cell">{formatUah(row.turnover_uah)}</td>
                <td>
                  {status && (
                    <StatusBadge
                      label={CLIENT_STATUS_LABELS[status]}
                      tone={CLIENT_STATUS_TONES[status]}
                    />
                  )}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    {row.id && (
                      <Button
                        asChild
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Історія замовлень"
                      >
                        <Link href={`/clients/${row.id}`}>
                          <History className="size-4" />
                        </Link>
                      </Button>
                    )}
                    {row.id && (
                      <Button
                        asChild
                        variant="ghost"
                        size="icon-sm"
                        aria-label="Редагувати"
                      >
                        <Link href={`/clients/${row.id}/edit`}>
                          <Pencil className="size-4" />
                        </Link>
                      </Button>
                    )}
                    <ConfirmDeleteDialog
                      title="Видалити клієнта?"
                      description={`Клієнта «${row.name}» буде видалено. Якщо за ним є замовлення — видалення не виконається.`}
                      action={deleteClientAction}
                      id={row.id!}
                    />
                  </div>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
