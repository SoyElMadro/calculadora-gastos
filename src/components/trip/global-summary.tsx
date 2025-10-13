'use client';

import { useExpenseStore } from '@/store/expense-store';
import { Card } from '@/components/ui/card';
import { formatCurrency } from '@/lib/utils';
import { TrendingUp, Receipt, Users, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

export function GlobalSummary() {
  const trips = useExpenseStore((state) => state.trips);

  const stats = {
    totalTrips: trips.length,
    totalExpenses: trips.reduce(
      (sum, trip) =>
        sum + trip.expenses.reduce((expSum, exp) => expSum + exp.amount, 0),
      0
    ),
    totalExpenseCount: trips.reduce(
      (sum, trip) => sum + trip.expenses.length,
      0
    ),
    totalParticipants: new Set(
      trips.flatMap((trip) => trip.participants.map((p) => p.id))
    ).size,
  };

  if (trips.length === 0) return null;

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
      {/* Total Gastado */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-2 md:col-span-1"
      >
        <Card className="p-4 glass flex flex-col items-center justify-center">
          <div className="p-2 rounded-lg bg-primary/10 mb-2">
            <TrendingUp className="size-8 text-primary" />
          </div>
          <p className="text-xs text-muted-foreground mb-1 text-center">Total Gastado</p>
          <p className="text-2xl font-bold text-primary text-center">{formatCurrency(stats.totalExpenses)}</p>
        </Card>
      </motion.div>

      {/* Viajes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-1 md:col-span-1"
      >
        <Card className="p-4 glass flex flex-col items-center justify-center">
          <div className="p-2 rounded-lg bg-secondary/10 mb-2">
            <Calendar className="size-8 text-secondary" />
          </div>
          <p className="text-xs text-muted-foreground mb-1 text-center">Viajes</p>
          <p className="text-2xl font-bold text-secondary text-center">{stats.totalTrips}</p>
        </Card>
      </motion.div>

      {/* Gastos */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-1 md:col-span-1"
      >
        <Card className="p-4 glass flex flex-col items-center justify-center">
          <div className="p-2 rounded-lg bg-accent/10 mb-2">
            <Receipt className="size-8 text-accent" />
          </div>
          <p className="text-xs text-muted-foreground mb-1 text-center">Gastos</p>
          <p className="text-2xl font-bold text-accent text-center">{stats.totalExpenseCount}</p>
        </Card>
      </motion.div>

      {/* Participantes */}
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="col-span-2 md:col-span-1"
      >
        <Card className="p-4 glass flex flex-col items-center justify-center">
          <div className="p-2 rounded-lg bg-blue-400/10 mb-2">
            <Users className="size-8 text-blue-400" />
          </div>
          <p className="text-xs text-muted-foreground mb-1 text-center">Participantes</p>
          <p className="text-2xl font-bold text-blue-400 text-center">{stats.totalParticipants}</p>
        </Card>
      </motion.div>
    </div>
  );
}
