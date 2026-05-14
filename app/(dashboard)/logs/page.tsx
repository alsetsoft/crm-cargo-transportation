import { ModulePage } from "@/components/crm/module-page";
import { StatusBadge } from "@/components/crm/status-badge";
import type { BadgeTone } from "@/lib/constants";
import { listAuditLogs, type AuditLogRow } from "@/lib/data/audit-logs";
import { formatDateTime } from "@/lib/format";

export const dynamic = "force-dynamic";

const ENTITY_LABELS: Record<string, string> = {
  client: "Клієнт",
  driver: "Водій",
  vehicle: "Авто",
  order: "Замовлення",
  expense: "Витрата",
  service_procedure: "Сервісна процедура",
  service_record: "Виконання процедури",
};

const ACTION_LABELS: Record<string, string> = {
  created: "Створено",
  updated: "Оновлено",
  deleted: "Видалено",
  completed: "Виконано",
  reverted: "Скасовано",
};

const ACTION_TONES: Record<string, BadgeTone> = {
  created: "success",
  updated: "info",
  deleted: "destructive",
  completed: "success",
  reverted: "warning",
};

function actionLabel(action: string): string {
  return ACTION_LABELS[action] ?? action;
}

function actionTone(action: string): BadgeTone {
  return ACTION_TONES[action] ?? "secondary";
}

function entityLabel(type: string): string {
  return ENTITY_LABELS[type] ?? type;
}

export default async function LogsPage() {
  const rows = await listAuditLogs(500);

  return (
    <ModulePage
      eyebrow="Система · Логи"
      title="Журнал змін"
      description="Усі зміни в CRM: створення, оновлення, видалення та виконання процедур."
    >
      {rows.length === 0 ? (
        <div className="panel-card flex flex-col items-center gap-2 p-10 text-center">
          <p className="text-base font-medium">Логів ще немає</p>
          <p className="text-sm text-muted-foreground">
            Журнал заповниться після першої зміни в системі.
          </p>
        </div>
      ) : (
        <div className="panel-card overflow-x-auto">
          <table className="data-table">
            <thead>
              <tr>
                <th>Час</th>
                <th>Дія</th>
                <th>Тип</th>
                <th>Об&apos;єкт</th>
                <th className="hidden md:table-cell">Деталі</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row: AuditLogRow) => (
                <tr key={row.id}>
                  <td className="whitespace-nowrap text-muted-foreground tabular-nums">
                    {formatDateTime(row.created_at)}
                  </td>
                  <td>
                    <StatusBadge
                      label={actionLabel(row.action)}
                      tone={actionTone(row.action)}
                    />
                  </td>
                  <td className="text-muted-foreground">
                    {entityLabel(row.entity_type)}
                  </td>
                  <td className="font-medium text-foreground">
                    {row.entity_label ?? "—"}
                  </td>
                  <td className="hidden text-muted-foreground md:table-cell">
                    {row.description ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </ModulePage>
  );
}
