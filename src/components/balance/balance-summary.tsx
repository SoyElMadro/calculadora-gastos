"use client";

import { useExpenseStore } from "@/store/expense-store";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { TrendingUp, TrendingDown, Minus } from "lucide-react";
import { motion } from "framer-motion";

export function BalanceSummary() {
  const { currentTrip, getBalances } = useExpenseStore();

  if (!currentTrip || currentTrip.participants.length === 0) {
    return null;
  }

  const balances = getBalances();

  return (
    <Card className="p-6 glass">
      <h3 className="text-2xl font-semibold mb-6">Balance Individual</h3>

      <div className="space-y-3">
        {balances.map((balance, index) => {
          const participant = currentTrip.participants.find(
            (p) => p.id === balance.participantId
          );

          if (!participant) return null;

          const isPositive = balance.balance > 0;
          const isZero = Math.abs(balance.balance) < 0.01;

          return (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="p-4 md:p-5 rounded-xl bg-dark-bg border border-dark-border shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex flex-col md:flex-row items-center md:items-start justify-between gap-4">
                {/* Avatar + Nombre */}
                <div className="flex flex-col md:flex-row items-center md:items-start gap-3 w-full md:w-auto text-center md:text-left">
                  <Avatar className="h-14 w-14">
                    <AvatarFallback
                      style={{ backgroundColor: participant.color }}
                    >
                      {participant.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold text-lg">{participant.name}</p>
                    <div className="flex flex-col md:flex-row items-center gap-1 md:gap-3 text-sm text-muted-foreground mt-1">
                      <span>Pagó: {formatCurrency(balance.totalPaid)}</span>
                      <span className="hidden md:inline">•</span>
                      <span>Debe: {formatCurrency(balance.totalOwed)}</span>
                    </div>
                  </div>
                </div>

                {/* Balance */}
                <div className="mt-3 md:mt-0 flex flex-col items-center md:items-end">
                  {isZero ? (
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Minus className="h-5 w-5" />
                      <span className="text-lg font-semibold">
                        {formatCurrency(0)}
                      </span>
                    </div>
                  ) : isPositive ? (
                    <div className="flex items-center gap-2 text-primary">
                      <TrendingUp className="h-5 w-5" />
                      <span className="text-lg font-semibold">
                        +{formatCurrency(balance.balance)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-2 text-accent">
                      <TrendingDown className="h-5 w-5" />
                      <span className="text-lg font-semibold">
                        {formatCurrency(balance.balance)}
                      </span>
                    </div>
                  )}
                  <p className="text-xs text-muted-foreground mt-1">
                    {isZero ? "Está al día" : isPositive ? "Le deben" : "Debe"}
                  </p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </Card>
  );
}
