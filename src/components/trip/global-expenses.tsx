"use client";

import { useExpenseStore } from "@/store/expense-store";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, CATEGORY_ICONS } from "@/lib/utils";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";

export function GlobalExpenses() {
  const trips = useExpenseStore((state) => state.trips);

  const allExpenses = trips.flatMap((trip) =>
    trip.expenses.map((expense) => ({
      ...expense,
      tripName: trip.name,
      tripId: trip.id,
    }))
  );

  const sortedExpenses = allExpenses.sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  if (sortedExpenses.length === 0) {
    return (
      <Card className="p-6 glass">
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            No hay gastos registrados aún
          </p>
        </div>
      </Card>
    );
  }

  const totalExpenses = allExpenses.reduce((sum, exp) => sum + exp.amount, 0);

  return (
    <Card className="p-6 glass">
      <div className="flex flex-col items-center text-center sm:flex-row sm:items-start sm:justify-between sm:text-left mb-6 gap-4">
        <h3 className="text-2xl font-semibold">Todos los Gastos</h3>
        <div>
          <p className="text-sm text-muted-foreground">Total</p>
          <p className="text-2xl font-bold text-primary">
            {formatCurrency(totalExpenses)}
          </p>
        </div>
      </div>

      <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
        {sortedExpenses.slice(0, 20).map((expense, index) => {
          const trip = trips.find((t) => t.id === expense.tripId);
          const payer = trip?.participants.find((p) => p.id === expense.paidBy);

          return (
            <motion.div
              key={expense.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: index * 0.02 }}
              className="p-4 rounded-lg bg-dark-bg border border-dark-border"
            >
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-4">
                {/* Información del gasto */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-xl">
                      {CATEGORY_ICONS[expense.category]}
                    </span>
                    <h4 className="font-semibold truncate">
                      {expense.description}
                    </h4>
                  </div>

                  <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground sm:mb-2">
                    <Badge variant="outline" className="text-xs">
                      {expense.tripName}
                    </Badge>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {format(new Date(expense.date), "d 'de' MMM", {
                        locale: es,
                      })}
                    </span>
                    <span>•</span>
                    <span>
                      Pagado por <strong>{payer?.name}</strong>
                    </span>
                  </div>
                </div>

                {/* Monto */}
                <div className="mt-0 text-left sm:text-right">
                  <p className="text-xl font-bold text-primary">
                    {formatCurrency(expense.amount)}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}

        {sortedExpenses.length > 20 && (
          <p className="text-center text-sm text-muted-foreground py-4">
            Mostrando los últimos 20 gastos de {sortedExpenses.length} totales
          </p>
        )}
      </div>
    </Card>
  );
}
