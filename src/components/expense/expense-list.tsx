'use client';

import { useExpenseStore } from '@/store/expense-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { formatCurrency, CATEGORY_ICONS, CATEGORY_LABELS } from '@/lib/utils';
import { Trash2, Receipt } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

export function ExpenseList() {
  const { currentTrip, removeExpense } = useExpenseStore();

  if (!currentTrip || currentTrip.expenses.length === 0) {
    return (
      <Card className="p-6 glass">
        <div className="text-center py-12">
          <Receipt className="h-12 w-12 mx-auto mb-4 text-muted-foreground opacity-50" />
          <p className="text-muted-foreground">
            No hay gastos registrados aún
          </p>
          <p className="text-sm text-muted-foreground mt-2">
            Agrega tu primer gasto para empezar
          </p>
        </div>
      </Card>
    );
  }

  const getPayer = (payerId: string) => {
    return currentTrip.participants.find(p => p.id === payerId);
  };

  const getSplitParticipants = (splitIds: string[]) => {
    return currentTrip.participants.filter(p => splitIds.includes(p.id));
  };

  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold flex items-center gap-2">
          <Receipt className="h-5 w-5 text-accent" />
          Gastos Registrados
        </h3>
        <Badge variant="secondary" className="bg-secondary/20">
          {currentTrip.expenses.length} {currentTrip.expenses.length === 1 ? 'gasto' : 'gastos'}
        </Badge>
      </div>

      <div className="space-y-3">
        <AnimatePresence>
          {currentTrip.expenses
            .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
            .map((expense, index) => {
              const payer = getPayer(expense.paidBy);
              const splitParticipants = getSplitParticipants(expense.splitBetween);
              const amountPerPerson = expense.amount / expense.splitBetween.length;

              return (
                <motion.div
                  key={expense.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -100 }}
                  transition={{ delay: index * 0.05 }}
                  className="p-4 rounded-lg bg-dark-bg border border-dark-border hover:border-primary/30 transition-all group"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      {/* Header */}
                      <div className="flex items-start gap-3 mb-2">
                        <span className="text-2xl">
                          {CATEGORY_ICONS[expense.category]}
                        </span>
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-lg truncate">
                            {expense.description}
                          </h4>
                          <div className="flex items-center gap-2 mt-1">
                            <Badge variant="outline" className="text-xs">
                              {CATEGORY_LABELS[expense.category]}
                            </Badge>
                            <span className="text-xs text-muted-foreground">
                              {format(new Date(expense.date), "d 'de' MMMM, HH:mm", { locale: es })}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Amount and Payer */}
                      <div className="flex items-center gap-3 mb-3">
                        <div className="text-2xl font-bold text-primary">
                          {formatCurrency(expense.amount)}
                        </div>
                        {payer && (
                          <div className="flex items-center gap-2 text-sm text-muted-foreground">
                            <span>Pagó:</span>
                            <div className="flex items-center gap-1.5">
                              <Avatar className="h-5 w-5">
                                <AvatarFallback 
                                  style={{ backgroundColor: payer.color }}
                                  className="text-xs"
                                >
                                  {payer.name.substring(0, 2).toUpperCase()}
                                </AvatarFallback>
                              </Avatar>
                              <span className="font-medium text-foreground">{payer.name}</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Split Between */}
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-sm text-muted-foreground">Dividido entre:</span>
                        {splitParticipants.map((participant) => (
                          <div
                            key={participant.id}
                            className="flex items-center gap-1.5 px-2 py-1 rounded-full bg-dark-surface"
                          >
                            <Avatar className="h-4 w-4">
                              <AvatarFallback 
                                style={{ backgroundColor: participant.color }}
                                className="text-[10px]"
                              >
                                {participant.name.substring(0, 2).toUpperCase()}
                              </AvatarFallback>
                            </Avatar>
                            <span className="text-xs font-medium">{participant.name}</span>
                            <span className="text-xs text-muted-foreground">
                              ({formatCurrency(amountPerPerson)})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Delete Button */}
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('¿Seguro que quieres eliminar este gasto?')) {
                          removeExpense(expense.id);
                        }
                      }}
                      className="transition-opacity hover:bg-red-500/20 hover:text-red-400 cursor-pointer shrink-0"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </motion.div>
              );
            })}
        </AnimatePresence>
      </div>

      {/* Total */}
      <div className="mt-4 pt-4 border-t border-dark-border">
        <div className="flex items-center justify-between text-lg font-semibold">
          <span>Total gastado:</span>
          <span className="text-2xl text-primary">
            {formatCurrency(
              currentTrip.expenses.reduce((sum, expense) => sum + expense.amount, 0)
            )}
          </span>
        </div>
      </div>
    </Card>
  );
}