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
    <div className="stack-table">
      <div className="stack-header grid-cols-[110px_1.6fr_1.2fr_0.7fr_0.8fr_0.8fr_0.7fr_120px]">
        <div>Код</div>
        <div>Назва</div>
        <div>Контакт</div>
        <div>Замовлень</div>
        <div>Оборот</div>
        <div>Борг</div>
        <div>Статус</div>
        <div className="text-right">Дії</div>
      </div>
      {rows.map((row) => {
        const status = row.status as ClientStatus | null;
        return (
          <div
            key={row.id ?? row.code ?? ""}
            className="stack-row md:grid-cols-[110px_1.6fr_1.2fr_0.7fr_0.8fr_0.8fr_0.7fr_120px]"
          >
            <div className="font-mono text-xs text-muted-foreground md:text-sm">
              <span className="stack-label">Код</span>
              {row.code}
            </div>
            <div>
              <span className="stack-label">Назва</span>
              <div className="font-medium text-foreground">{row.name}</div>
              {row.edrpou && (
                <p className="text-xs text-muted-foreground">ЄДРПОУ {row.edrpou}</p>
              )}
            </div>
            <div className="text-sm">
              <span className="stack-label">Контакт</span>
              {row.contact_person && <div>{row.contact_person}</div>}
              {row.phone && <div className="text-muted-foreground">{row.phone}</div>}
              {row.email && (
                <div className="truncate text-muted-foreground" title={row.email}>
                  {row.email}
                </div>
              )}
            </div>
            <div>
              <span className="stack-label">Замовлень</span>
              {formatNumber(row.orders_count)}
            </div>
            <div>
              <span className="stack-label">Оборот</span>
              {formatUah(row.turnover_uah)}
            </div>
            <div className={row.debt_uah && row.debt_uah > 0 ? "text-warning" : ""}>
              <span className="stack-label">Борг</span>
              {formatUah(row.debt_uah)}
            </div>
            <div>
              <span className="stack-label">Статус</span>
              {status && (
                <StatusBadge
                  label={CLIENT_STATUS_LABELS[status]}
                  tone={CLIENT_STATUS_TONES[status]}
                />
              )}
            </div>
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
          </div>
        );
      })}
    </div>
  );
}
