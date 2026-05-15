import { ModulePage } from "@/components/crm/module-page";
import { listAuditLogs } from "@/lib/data/audit-logs";

import { LogsTable } from "./_components/logs-table";

export const dynamic = "force-dynamic";

export default async function LogsPage() {
  const rows = await listAuditLogs(500);

  return (
    <ModulePage
      eyebrow="Система · Логи"
      title="Журнал змін"
      description="Усі зміни в CRM: створення, оновлення, видалення та виконання процедур."
    >
      <LogsTable rows={rows} />
    </ModulePage>
  );
}
