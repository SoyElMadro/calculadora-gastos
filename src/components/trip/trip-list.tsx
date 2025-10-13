'use client';

import { useExpenseStore } from '@/store/expense-store';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { formatCurrency } from '@/lib/utils';
import { ChevronRight, Calendar, Users, Receipt, Archive } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { motion } from 'framer-motion';

interface TripListProps {
  onSelectTrip: (tripId: string) => void;
}

export function TripList({ onSelectTrip }: TripListProps) {
  const trips = useExpenseStore((state) => state.trips);
  const getBalances = useExpenseStore((state) => state.getBalances);
  const setCurrentTrip = useExpenseStore((state) => state.setCurrentTrip);

  const activeTrips = trips.filter((t) => !t.archived);
  const archivedTrips = trips.filter((t) => t.archived);

  const handleSelectTrip = (tripId: string) => {
    setCurrentTrip(tripId);
    onSelectTrip(tripId);
  };

  const getTripStats = (trip: any) => {
    const totalExpenses = trip.expenses.reduce(
      (sum: number, exp: any) => sum + exp.amount,
      0
    );
    return {
      totalExpenses,
      expenseCount: trip.expenses.length,
      participantCount: trip.participants.length,
    };
  };

  const renderTripCard = (trip: any, index: number) => {
    const stats = getTripStats(trip);

    return (
      <motion.div
        key={trip.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
      >
        <Card
          className="p-5 glass hover:border-primary/50 transition-all cursor-pointer group"
          onClick={() => handleSelectTrip(trip.id)}
        >
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <h3 className="text-xl font-semibold truncate text-primary group-hover:text-primary-light transition-colors">
                  {trip.name}
                </h3>
                {trip.archived && (
                  <Badge variant="outline" className="text-xs">
                    <Archive className="h-3 w-3 mr-1" />
                    Archivado
                  </Badge>
                )}
              </div>

              {trip.description && (
                <p className="text-sm text-muted-foreground mb-3 line-clamp-2">
                  {trip.description}
                </p>
              )}

              <div className="flex flex-wrap gap-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>
                    {format(new Date(trip.startDate), "d 'de' MMM", {
                      locale: es,
                    })}
                  </span>
                </div>
                <div className="flex items-center gap-1">
                  <Users className="h-4 w-4" />
                  <span>{stats.participantCount} participantes</span>
                </div>
                <div className="flex items-center gap-1">
                  <Receipt className="h-4 w-4" />
                  <span>{stats.expenseCount} gastos</span>
                </div>
              </div>
            </div>

            <div className="flex flex-col items-end gap-2">
              <div className="text-right">
                <p className="text-xs text-muted-foreground">Total gastado</p>
                <p className="text-2xl font-bold text-primary">
                  {formatCurrency(stats.totalExpenses)}
                </p>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
            </div>
          </div>
        </Card>
      </motion.div>
    );
  };

  if (trips.length === 0) {
    return null;
  }

  return (
    <div className="space-y-6">
      {activeTrips.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4">Viajes Activos</h2>
          <div className="space-y-3">
            {activeTrips.map((trip, index) => renderTripCard(trip, index))}
          </div>
        </div>
      )}

      {archivedTrips.length > 0 && (
        <div>
          <h2 className="text-2xl font-semibold mb-4 flex items-center gap-2">
            <Archive className="h-6 w-6" />
            Archivados
          </h2>
          <div className="space-y-3 opacity-60">
            {archivedTrips.map((trip, index) => renderTripCard(trip, index))}
          </div>
        </div>
      )}
    </div>
  );
}