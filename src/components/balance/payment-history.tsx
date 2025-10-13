"use client";

import { useExpenseStore } from "@/store/expense-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, Trash2, Calendar, FileText } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { motion, AnimatePresence } from "framer-motion";

export function PaymentHistory() {
  const { currentTrip, removePayment } = useExpenseStore();

  if (!currentTrip || currentTrip.payments.length === 0) {
    return null;
  }

  const sortedPayments = [...currentTrip.payments].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <Card className="p-6 glass">
      <h3 className="text-2xl font-semibold mb-6 flex items-center gap-2">
        <FileText className="h-6 w-6 text-primary" />
        Historial de Pagos
      </h3>

      <div className="space-y-3">
        <AnimatePresence>
          {sortedPayments.map((payment, index) => {
            const from = currentTrip.participants.find(
              (p) => p.id === payment.from
            );
            const to = currentTrip.participants.find(
              (p) => p.id === payment.to
            );

            if (!from || !to) return null;

            return (
              <motion.div
                key={payment.id}
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -100 }}
                transition={{ delay: index * 0.05 }}
                className="group relative"
              >
                <div className="p-4 rounded-lg bg-dark-bg hover:bg-dark-surface transition-all border border-dark-border">
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-1">
                      <Avatar className="h-10 w-10">
                        <AvatarFallback style={{ backgroundColor: from.color }}>
                          {from.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium">
                          {from.name}{" "}
                          <ArrowRight className="inline h-4 w-4 mx-1" />{" "}
                          {to.name}
                        </p>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          <span>
                            {format(
                              new Date(payment.date),
                              "d 'de' MMM, HH:mm",
                              {
                                locale: es,
                              }
                            )}
                          </span>
                          {payment.note && (
                            <>
                              <span>•</span>
                              <span className="truncate">{payment.note}</span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="text-right">
                        <p className="text-lg font-bold text-primary">
                          {formatCurrency(payment.amount)}
                        </p>
                      </div>

                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          if (confirm("¿Eliminar este pago?")) {
                            removePayment(payment.id);
                          }
                        }}
                        className="hover:bg-red-500/20 hover:text-red-400 cursor-pointer ml-2"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>
    </Card>
  );
}
