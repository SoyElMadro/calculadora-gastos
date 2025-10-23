"use client";

import { useState } from "react";
import { useExpenseStore } from "@/store/expense-store";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Dialog } from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { ArrowRight, CheckCircle2, Copy, DollarSign } from "lucide-react";
import { motion } from "framer-motion";
import { PaymentTracker } from "./payment-tracker";

export function SettlementView() {
  const { currentTrip, getSettlements } = useExpenseStore();
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);
  const [selectedSettlement, setSelectedSettlement] = useState<any>(null);

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

  const copyToClipboard = (settlement: any, index: number) => {
    const from = currentTrip.participants.find((p) => p.id === settlement.from);
    const to = currentTrip.participants.find((p) => p.id === settlement.to);

    const text = `${from?.name} debe pagarle ${formatCurrency(
      settlement.amount
    )} a ${to?.name}`;
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

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
    <>
      <Card className="p-4 sm:p-6 glass">
        {/* Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6">
          <h3 className="text-xl sm:text-2xl font-semibold text-center sm:text-left w-full sm:w-auto">
            ¿Quién debe a quién?
          </h3>
          <Button
            variant="outline"
            size="sm"
            onClick={copyAllSettlements}
            className="border-primary/30 hover:bg-primary/10 cursor-pointer w-full sm:w-auto"
          >
            <Copy className="h-4 w-4 mr-2" />
            Copiar todo
          </Button>
        </div>

        {/* Settlements list */}
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
                className="relative group"
              >
                <div className="p-4 sm:p-5 rounded-lg bg-gradient-to-r from-dark-bg to-dark-surface border border-dark-border hover:border-primary/50 transition-all">
                  {/* Names and Amount */}
                  <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-3 text-center sm:text-left">
                    {/* From */}
                    <div className="flex items-center justify-center sm:justify-start gap-3 flex-1">
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarFallback style={{ backgroundColor: from.color }}>
                          {from.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-semibold text-sm sm:text-base">{from.name}</p>
                        <p className="text-xs text-muted-foreground">Debe pagar</p>
                      </div>
                    </div>

                    {/* Arrow + Amount */}
                    <div className="flex flex-col items-center gap-1">
                      <motion.div
                        animate={{ x: [0, 5, 0] }}
                        transition={{ repeat: Infinity, duration: 1.5 }}
                      >
                        <ArrowRight className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
                      </motion.div>
                      <div className="bg-primary/20 px-3 py-1 rounded-full">
                        <p className="text-sm sm:text-lg font-bold text-primary whitespace-nowrap">
                          {formatCurrency(settlement.amount)}
                        </p>
                      </div>
                    </div>

                    {/* To */}
                    <div className="flex items-center justify-center sm:justify-end gap-3 flex-1">
                      <div className="text-right">
                        <p className="font-semibold text-sm sm:text-base">{to.name}</p>
                        <p className="text-xs text-muted-foreground">Recibe</p>
                      </div>
                      <Avatar className="h-10 w-10 sm:h-12 sm:w-12">
                        <AvatarFallback style={{ backgroundColor: to.color }}>
                          {to.name.substring(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center gap-3 mt-6">
                    <Button
                      onClick={() => setSelectedSettlement(settlement)}
                      className="w-full sm:w-auto bg-primary hover:bg-primary-dark cursor-pointer text-sm sm:text-base"
                      size="sm"
                    >
                      <DollarSign className="h-4 w-4 mr-2" />
                      Registrar Pago
                    </Button>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(settlement, index)}
                      className="border-primary/30 hover:bg-primary/10 w-full sm:w-auto cursor-pointer text-sm sm:text-base"
                    >
                      {copiedIndex === index ? (
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                      ) : (
                        <Copy className="h-4 w-4" />
                      )}
                    </Button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </Card>

      {/* Dialog para registrar pago */}
      <Dialog
        open={!!selectedSettlement}
        onOpenChange={() => setSelectedSettlement(null)}
      >
        {selectedSettlement && (
          <PaymentTracker
            settlement={selectedSettlement}
            onClose={() => setSelectedSettlement(null)}
          />
        )}
      </Dialog>
    </>
  );
}
