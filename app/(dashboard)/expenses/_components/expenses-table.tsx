import { deleteExpenseAction } from "@/actions/expenses";
import { ConfirmDeleteDialog } from "@/components/crm/confirm-delete-dialog";
import type { ExpenseRow, ExpenseWithOrder } from "@/lib/data/expenses";
import { formatDate, formatUah } from "@/lib/format";

import { ExpenseFormDialog } from "./expense-form-dialog";

type OrderOption = { id: string; number: string; client_name: string };

type ExpensesTableProps = {
  rows: ExpenseWithOrder[];
  orderOptions: OrderOption[];
};

export function ExpensesTable({ rows, orderOptions }: ExpensesTableProps) {
  if (rows.length === 0) {
    return (
      <div className="panel-card flex flex-col items-center gap-2 p-10 text-center">
        <p className="text-base font-medium">Витрат ще немає</p>
        <p className="text-sm text-muted-foreground">
          Натисніть «Нова витрата», щоб додати першу.
        </p>
      </div>
    );
  }

  const total = rows.reduce((sum, r) => sum + Number(r.amount_uah ?? 0), 0);

  return (
    <div className="space-y-3">
      <div className="panel-card flex items-center justify-between px-5 py-3 text-sm">
        <span className="text-muted-foreground">Всього записів</span>
        <div className="flex items-center gap-6">
          <span className="tabular-nums">{rows.length}</span>
          <span className="text-muted-foreground">Сума:</span>
          <span className="font-medium tabular-nums">{formatUah(total)}</span>
        </div>
      </div>
      <div className="panel-card overflow-x-auto">
        <table className="data-table">
          <thead>
            <tr>
              <th className="hidden md:table-cell">Дата</th>
              <th>Назва</th>
              <th className="hidden md:table-cell">Замовлення</th>
              <th className="text-right">Сума</th>
              <th className="hidden md:table-cell">Примітки</th>
              <th className="text-right">Дії</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.id}>
                <td className="hidden text-muted-foreground tabular-nums md:table-cell">
                  {formatDate(row.spent_at)}
                </td>
                <td className="font-medium text-foreground">
                  <div>{row.name}</div>
                  <div className="mt-1 space-y-0.5 text-xs text-muted-foreground md:hidden">
                    <div className="tabular-nums">{formatDate(row.spent_at)}</div>
                    {row.order_number && (
                      <div>
                        №{row.order_number}
                        {row.client_name ? ` · ${row.client_name}` : ""}
                      </div>
                    )}
                  </div>
                </td>
                <td className="hidden md:table-cell">
                  {row.order_number ? (
                    <div>
                      <div className="font-mono">№{row.order_number}</div>
                      {row.client_name && (
                        <div className="text-xs text-muted-foreground">
                          {row.client_name}
                        </div>
                      )}
                    </div>
                  ) : (
                    <span className="text-muted-foreground">—</span>
                  )}
                </td>
                <td className="text-right tabular-nums">
                  {formatUah(row.amount_uah)}
                </td>
                <td
                  className="hidden max-w-[260px] truncate text-muted-foreground md:table-cell"
                  title={row.notes ?? undefined}
                >
                  {row.notes ?? "—"}
                </td>
                <td className="text-right">
                  <div className="flex items-center justify-end gap-1">
                    <ExpenseFormDialog
                      mode="edit"
                      expense={row as unknown as ExpenseRow}
                      orderOptions={orderOptions}
                    />
                    <ConfirmDeleteDialog
                      title="Видалити витрату?"
                      description={`Витрату «${row.name}» буде видалено.`}
                      action={deleteExpenseAction}
                      id={row.id}
                    />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
