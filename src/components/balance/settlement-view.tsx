"use client";

import { useExpenseStore } from "@/store/expense-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Copy } from "lucide-react";
import { motion } from "framer-motion";

export function SettlementView() {
  const { currentTrip, getSettlements } = useExpenseStore();

  if (!currentTrip || currentTrip.participants.length === 0) {
    return null;
  }

  const settlements = getSettlements();

  if (settlements.length === 0) {
    return (
      <Card className="p-6 glass">
        <div className="text-center py-12">
          <CheckCircle2 className="h-16 w-16 text-primary mx-auto mb-4" />
          <h3 className="text-2xl font-semibold mb-2">¡Todo liquidado! 🎉</h3>
          <p className="text-muted-foreground">No hay deudas pendientes</p>
        </div>
      </Card>
    );
  }

  const copyAllSettlements = () => {
    const text = settlements
      .map((s) => {
        const from = currentTrip.participants.find((p) => p.id === s.from);
        const to = currentTrip.participants.find((p) => p.id === s.to);
        return `• ${from?.name} debe pagarle ${formatCurrency(s.amount)} a ${
          to?.name
        }`;
      })
      .join("\n");

    navigator.clipboard.writeText(`Resumen de liquidación:\n\n${text}`);
  };

  return (
    <Card className="p-6 glass">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-2xl font-semibold">¿Quién debe a quién?</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={copyAllSettlements}
          className="border-primary/30 hover:bg-primary/10 cursor-pointer"
        >
          <Copy className="h-4 w-4 mr-2" />
          Copiar todo
        </Button>
      </div>

      <div className="space-y-4">
        {settlements.map((settlement, index) => {
          const from = currentTrip.participants.find(
            (p) => p.id === settlement.from
          );
          const to = currentTrip.participants.find(
            (p) => p.id === settlement.to
          );

          if (!from || !to) return null;

          return (
            <motion.div
              key={`${settlement.from}-${settlement.to}`}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: index * 0.1 }}
              className="relative"
            >
              <div className="p-5 rounded-lg bg-gradient-to-r from-dark-bg to-dark-surface border border-dark-border hover:border-primary/50 transition-all flex flex-col md:flex-row gap-4">
                {/* From */}
                <div className="flex items-center gap-3 flex-1">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback style={{ backgroundColor: from.color }}>
                      {from.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{from.name}</p>
                    <p className="text-xs text-muted-foreground">Debe pagar</p>
                  </div>
                </div>

                {/* Amount & Arrow */}
                <div className="flex flex-col items-center gap-1 px-4">
                  <motion.div
                    animate={{ x: [0, 5, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    <ArrowRight className="h-6 w-6 text-primary" />
                  </motion.div>
                  <div className="bg-primary/20 px-3 py-1 rounded-full">
                    <p className="text-lg font-bold text-primary whitespace-nowrap">
                      {formatCurrency(settlement.amount)}
                    </p>
                  </div>
                </div>

                {/* To */}
                <div className="flex items-center gap-3 flex-1 justify-end md:justify-end">
                  <div className="text-right">
                    <p className="font-semibold">{to.name}</p>
                    <p className="text-xs text-muted-foreground">Recibe</p>
                  </div>
                  <Avatar className="h-12 w-12">
                    <AvatarFallback style={{ backgroundColor: to.color }}>
                      {to.name.substring(0, 2).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="mt-6 p-4 rounded-lg bg-primary/10 border border-primary/30">
        <p className="text-sm text-center">
          💡 <strong>Tip:</strong> Con {settlements.length}{" "}
          {settlements.length === 1 ? "pago" : "pagos"} se saldan todas las
          deudas
        </p>
      </div>
    </Card>
  );
}
