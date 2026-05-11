import { deleteClientAction } from "@/actions/clients";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import { StatusBadge } from "@/components/crm/status-badge";
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_TONES,
  type ClientStatus,
} from "@/lib/constants";
import type { ClientRow, ClientWithStats } from "@/lib/data/clients";
import { formatNumber, formatUah } from "@/lib/format";

import { ClientFormDialog } from "./client-form-dialog";

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
            <th>Код</th>
            <th>Назва</th>
            <th>Контактна особа</th>
            <th>Телефон</th>
            <th>Email</th>
            <th>ЄДРПОУ</th>
            <th className="text-right">Замовлень</th>
            <th className="text-right">Оборот</th>
            <th className="text-right">Заборгованість</th>
            <th>Статус</th>
            <th className="text-right">Дії</th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => {
            const status = row.status as ClientStatus | null;
            const hasDebt = !!row.debt_uah && row.debt_uah > 0;
            return (
              <tr key={row.id ?? row.code ?? ""}>
                <td className="font-mono text-muted-foreground">{row.code}</td>
                <td className="font-medium text-foreground">{row.name}</td>
                <td>{row.contact_person ?? "—"}</td>
                <td className="text-muted-foreground">{row.phone ?? "—"}</td>
                <td className="text-muted-foreground" title={row.email ?? undefined}>
                  {row.email ?? "—"}
                </td>
                <td className="font-mono text-muted-foreground">{row.edrpou ?? "—"}</td>
                <td className="text-right tabular-nums">{formatNumber(row.orders_count)}</td>
                <td className="text-right tabular-nums">{formatUah(row.turnover_uah)}</td>
                <td className={`text-right tabular-nums ${hasDebt ? "text-warning font-medium" : ""}`}>
                  {formatUah(row.debt_uah)}
                </td>
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
                    <ClientFormDialog
                      mode="edit"
                      client={row as unknown as ClientRow}
                    />
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
