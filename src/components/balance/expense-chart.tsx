"use client";

import { useExpenseStore } from "@/store/expense-store";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  TooltipContentProps,
} from "recharts";
import { formatCurrency } from "@/lib/utils";

export function ExpenseChart() {
  const { currentTrip, getBalances } = useExpenseStore();

  if (!currentTrip || currentTrip.participants.length === 0) {
    return null;
  }

  const balances = getBalances();

  const chartData = balances
    .map((balance) => {
      const participant = currentTrip.participants.find(
        (p) => p.id === balance.participantId
      );
      return {
        name: participant?.name || "",
        paid: balance.totalPaid,
        color: participant?.color || "#10B981",
      };
    })
    .sort((a, b) => b.paid - a.paid);

  if (chartData.every((d) => d.paid === 0)) {
    return null;
  }

  // Tooltip personalizado
  const CustomTooltip = ({
    active,
    payload,
    label,
  }: TooltipContentProps<any, any>) => {
    if (active && payload && payload.length) {
      const value = payload[0].value;
      return (
        <div className="bg-[#1E293B] border border-[#334155] rounded p-2 text-white">
          <p className="font-semibold text-primary">{label}</p>
          <p>Pagó : {formatCurrency(value)}</p>
        </div>
      );
    }
    return null;
  };

  return (
    <Card className="p-6 glass">
      <h3 className="text-2xl font-semibold mb-6">¿Quién pagó más?</h3>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#334155" />
            <XAxis
              dataKey="name"
              stroke="#94A3B8"
              style={{ fontSize: "12px" }}
            />
            <YAxis
              stroke="#94A3B8"
              style={{ fontSize: "12px" }}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip content={(props) => <CustomTooltip {...props} />} />
            <Bar dataKey="paid" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
