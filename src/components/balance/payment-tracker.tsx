"use client";

import { useState } from "react";
import { useExpenseStore } from "@/store/expense-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { formatCurrency } from "@/lib/utils";
import { DollarSign, ArrowRight } from "lucide-react";

interface PaymentTrackerProps {
  settlement: {
    from: string;
    to: string;
    amount: number;
  };
  onClose: () => void;
}

export function PaymentTracker({ settlement, onClose }: PaymentTrackerProps) {
  const { currentTrip, addPayment } = useExpenseStore();
  const [amount, setAmount] = useState(settlement.amount.toString());
  const [note, setNote] = useState("");
  const [isPartial, setIsPartial] = useState(false);

  if (!currentTrip) return null;

  const from = currentTrip.participants.find((p) => p.id === settlement.from);
  const to = currentTrip.participants.find((p) => p.id === settlement.to);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const paymentAmount = parseFloat(amount);

    if (paymentAmount <= 0 || paymentAmount > settlement.amount) {
      alert("Monto inválido");
      return;
    }

    addPayment({
      from: settlement.from,
      to: settlement.to,
      amount: paymentAmount,
      date: new Date(),
      note: note || undefined,
    });

    onClose();
  };

  return (
    <DialogContent className="bg-dark-surface border-dark-border">
      <DialogHeader>
        <DialogTitle className="text-2xl">Registrar Pago</DialogTitle>
        <DialogDescription>
          Registra un pago para actualizar el balance
        </DialogDescription>
      </DialogHeader>

      <div className="space-y-4">
        {/* Payment Summary */}
        <div className="p-4 rounded-lg bg-dark-bg border border-primary/30">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarFallback style={{ backgroundColor: from?.color }}>
                  {from?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <span className="font-semibold">{from?.name}</span>
            </div>

            <ArrowRight className="h-5 w-5 text-primary" />

            <div className="flex items-center gap-3">
              <span className="font-semibold">{to?.name}</span>
              <Avatar>
                <AvatarFallback style={{ backgroundColor: to?.color }}>
                  {to?.name.substring(0, 2).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </div>
          </div>

          <div className="mt-3 text-center">
            <p className="text-sm text-muted-foreground mb-1">Deuda total</p>
            <p className="text-2xl font-bold text-primary">
              {formatCurrency(settlement.amount)}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto a pagar</Label>
            <div className="flex gap-2">
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                max={settlement.amount}
                value={amount}
                onChange={(e) => {
                  setAmount(e.target.value);
                  setIsPartial(parseFloat(e.target.value) < settlement.amount);
                }}
                className="bg-dark-bg border-dark-border"
                required
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setAmount(settlement.amount.toString());
                  setIsPartial(false);
                }}
                className="whitespace-nowrap cursor-pointer hover:bg-dark-bg"
              >
                Pagar todo
              </Button>
            </div>
            {isPartial && (
              <p className="text-xs text-amber-400">
                ⚠️ Pago parcial. Quedarán{" "}
                {formatCurrency(settlement.amount - parseFloat(amount || "0"))}{" "}
                pendientes
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="note">Nota (opcional)</Label>
            <Input
              id="note"
              placeholder="Ej: Transferencia bancaria"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="bg-dark-bg border-dark-border"
            />
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 cursor-pointer hover:bg-dark-bg"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              className="flex-1 bg-primary hover:bg-primary-dark cursor-pointer"
            >
              <DollarSign className="h-4 w-4 mr-2" />
              Registrar Pago
            </Button>
          </div>
        </form>
      </div>
    </DialogContent>
  );
}
