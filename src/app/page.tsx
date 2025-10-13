'use client';

import { useState } from 'react';
import { useExpenseStore } from '@/store/expense-store';
import { TripCreator } from '@/components/trip/trip-creator';
import { TripList } from '@/components/trip/trip-list';
import { TripHeader } from '@/components/trip/trip-header';
import { GlobalSummary } from '@/components/trip/global-summary';
import { GlobalExpenses } from '@/components/trip/global-expenses';
import { ParticipantManager } from '@/components/expense/participant-manager';
import { ExpenseForm } from '@/components/expense/expense-form';
import { ExpenseList } from '@/components/expense/expense-list';
import { BalanceSummary } from '@/components/balance/balance-summary';
import { SettlementView } from '@/components/balance/settlement-view';
import { ExpenseChart } from '@/components/balance/expense-chart';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Receipt, Calculator, BarChart3, Home } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function HomePage() {
  const [view, setView] = useState<'home' | 'trip'>('home');
  const currentTrip = useExpenseStore((state) => state.currentTrip);
  const trips = useExpenseStore((state) => state.trips);

  const handleSelectTrip = () => {
    setView('trip');
  };

  const handleBackToHome = () => {
    setView('home');
  };

  return (
    <main className="min-h-screen p-4 md:p-8 pb-20">
      <div className="max-w-7xl mx-auto">
        <AnimatePresence mode="wait">
          {view === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.2 }}
            >
              {/* Header */}
              <header className="mb-8">
                <div className="text-center mb-6">
                  <h1 className="text-4xl md:text-6xl font-bold mb-2">
                    <span className="gradient-text">Calculador de Gastos</span> 💰
                  </h1>
                  <p className="text-muted-foreground text-lg">
                    Divide gastos fácilmente con amigos y familia
                  </p>
                </div>
              </header>

              {/* Global Summary */}
              {trips.length > 0 && (
                <div className="space-y-6">
                  <GlobalSummary />

                    <Tabs
                      defaultValue="trips"
                      className="w-full"
                    >
                      <TabsList className="grid w-full max-w-lg mx-auto grid-cols-2 gap-x-4 mb-6 bg-dark-surface">
                        <TabsTrigger
                          value="trips"
                          className="flex items-center gap-2 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          <Home className="h-4 w-4" />
                          <span>Mis Eventos</span>
                        </TabsTrigger>
                        <TabsTrigger
                          value="expenses"
                          className="flex items-center gap-2 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground"
                        >
                          <Receipt className="h-4 w-4" />
                          <span>Todos los Gastos</span>
                        </TabsTrigger>
                      </TabsList>

                      <TabsContent value="trips">
                        <TripList onSelectTrip={handleSelectTrip} />
                      </TabsContent>

                      <TabsContent value="expenses">
                        <GlobalExpenses />
                      </TabsContent>

                      <div className="flex justify-center mt-4">
                        <TripCreator />
                      </div>
                    </Tabs>
                </div>
              )}

              {trips.length === 0 && (
                <div className="flex flex-col items-center justify-center min-h-[50vh] space-y-6">
                  <div className="text-center space-y-3">
                    <h2 className="text-3xl font-semibold gradient-text">¡Comencemos!</h2>
                    <p className="text-muted-foreground text-lg max-w-md">
                      Crea tu primer viaje o evento para empezar a dividir gastos de forma inteligente
                    </p>
                    <div className="flex justify-center">
                      <TripCreator />
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="trip"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.2 }}
            >
              {currentTrip && (
                <div className="space-y-6">
                  <TripHeader onBack={handleBackToHome} />

                  <Tabs defaultValue="expenses" className="w-full">
                    <TabsList className="grid w-full max-w-lg mx-auto grid-cols-3 gap-x-4 mb-6 bg-dark-surface">
                      <TabsTrigger value="expenses" className="flex items-center gap-2 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-dark-bg transition-colors">
                        <Receipt className="h-4 w-4" />
                        <span className="hidden sm:inline">Gastos</span>
                      </TabsTrigger>
                      <TabsTrigger value="balance" className="flex items-center gap-2 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-dark-bg transition-colors">
                        <Calculator className="h-4 w-4" />
                        <span className="hidden sm:inline">Balance</span>
                      </TabsTrigger>
                      <TabsTrigger value="stats" className="flex items-center gap-2 cursor-pointer data-[state=active]:bg-primary data-[state=active]:text-primary-foreground hover:bg-dark-bg transition-colors">
                        <BarChart3 className="h-4 w-4" />
                        <span className="hidden sm:inline">Gráficos</span>
                      </TabsTrigger>
                    </TabsList>

                    <TabsContent value="expenses" className="space-y-6">
                      <div className="grid lg:grid-cols-2 gap-6">
                        <ParticipantManager />
                        <ExpenseForm />
                      </div>
                      <ExpenseList />
                    </TabsContent>

                    <TabsContent value="balance" className="space-y-6">
                      <BalanceSummary />
                      <SettlementView />
                    </TabsContent>

                    <TabsContent value="stats" className="space-y-6">
                      <ExpenseChart />
                    </TabsContent>
                  </Tabs>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </main>
  );
}