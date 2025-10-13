"use client";

import { useState } from "react";
import { useExpenseStore } from "@/store/expense-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { CATEGORY_ICONS, CATEGORY_LABELS } from "@/lib/utils";
import { Receipt } from "lucide-react";
import { motion } from "framer-motion";

export function ExpenseForm() {
  const { currentTrip, addExpense } = useExpenseStore();
  const [description, setDescription] = useState("");
  const [amount, setAmount] = useState("");
  const [paidBy, setPaidBy] = useState("");
  const [category, setCategory] = useState<
    "food" | "transport" | "accommodation" | "entertainment" | "other"
  >("food");
  const [splitBetween, setSplitBetween] = useState<string[]>([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!description || !amount || !paidBy || splitBetween.length === 0) {
      alert("Por favor completa todos los campos");
      return;
    }

    addExpense({
      description,
      amount: parseFloat(amount),
      paidBy,
      splitBetween,
      category,
      date: new Date(),
    });

    // Reset form
    setDescription("");
    setAmount("");
    setSplitBetween([]);
  };

  const toggleParticipant = (id: string) => {
    setSplitBetween((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id]
    );
  };

  const selectAll = () => {
    if (currentTrip) {
      setSplitBetween(currentTrip.participants.map((p) => p.id));
    }
  };

  if (!currentTrip || currentTrip.participants.length === 0) {
    return (
      <Card className="p-6 glass">
        <p className="text-center text-muted-foreground">
          Agrega participantes para empezar a registrar gastos
        </p>
      </Card>
    );
  }

  return (
    <Card className="p-6 glass">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <Receipt className="h-5 w-5 text-secondary" />
        Agregar Gasto
      </h3>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="description">Descripción</Label>
          <Input
            id="description"
            placeholder="Ej: Cena en restaurante"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-dark-bg border-dark-border"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              placeholder="0.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="bg-dark-bg border-dark-border"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Categoría</Label>
            <Select
              value={category}
              onValueChange={(value: any) => setCategory(value)}
            >
              <SelectTrigger className="bg-dark-bg border-dark-border">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-dark-surface border-dark-border select-content">
                {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
                  <SelectItem key={key} value={key}>
                    {CATEGORY_ICONS[key as keyof typeof CATEGORY_ICONS]} {label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paidBy">¿Quién pagó?</Label>
          <Select value={paidBy} onValueChange={setPaidBy}>
            <SelectTrigger className="bg-dark-bg border-dark-border">
              <SelectValue placeholder="Selecciona quién pagó" />
            </SelectTrigger>
            <SelectContent className="bg-dark-surface border-dark-border select-content">
              {currentTrip.participants.map((participant) => (
                <SelectItem
                  key={participant.id}
                  value={participant.id}
                  className="cursor-pointer hover:bg-dark-bg/80"
                >
                  {participant.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label>¿Entre quiénes se divide?</Label>
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                if (splitBetween.length === currentTrip.participants.length) {
                  setSplitBetween([]);
                } else {
                  selectAll();
                }
              }}
              className="text-primary hover:text-primary-dark cursor-pointer"
            >
              {splitBetween.length === currentTrip.participants.length
                ? "Quitar todos"
                : "Seleccionar todos"}
            </Button>
          </div>
          <div className="space-y-2">
            {currentTrip.participants.map((participant) => (
              <motion.div
                key={participant.id}
                whileHover={{ scale: 1.02 }}
                className="flex items-center space-x-2 p-2 rounded-lg hover:bg-dark-bg transition-colors"
              >
                <Checkbox
                  id={participant.id}
                  checked={splitBetween.includes(participant.id)}
                  onCheckedChange={() => toggleParticipant(participant.id)}
                />
                <label
                  htmlFor={participant.id}
                  className="flex-1 cursor-pointer text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                >
                  {participant.name}
                </label>
              </motion.div>
            ))}
          </div>
        </div>

        <Button
          type="submit"
          className="w-full transition-opacity cursor-pointer"
        >
          Agregar Gasto
        </Button>
      </form>
    </Card>
  );
}
