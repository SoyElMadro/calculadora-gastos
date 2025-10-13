import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Participant, Expense, Settlement, Balance, Trip, Payment } from '@/types';
import { generateId } from '@/lib/utils';

interface ExpenseStore {
  currentTrip: Trip | null;
  trips: Trip[];

  // Trip actions
  createTrip: (name: string, description?: string) => void;
  setCurrentTrip: (tripId: string) => void;
  updateTrip: (tripId: string, data: Partial<Trip>) => void;
  deleteTrip: (tripId: string) => void;

  // Participant actions
  addParticipant: (name: string) => void;
  removeParticipant: (participantId: string) => void;
  updateParticipant: (participantId: string, data: Partial<Participant>) => void;

  // Expense actions
  addExpense: (expense: Omit<Expense, 'id'>) => void;
  removeExpense: (expenseId: string) => void;
  updateExpense: (expenseId: string, data: Partial<Expense>) => void;

  // Payment actions - NUEVO
  addPayment: (payment: Omit<Payment, 'id'>) => void;
  removePayment: (paymentId: string) => void;

  // Calculations
  getBalances: () => Balance[];
  getSettlements: () => Settlement[];
}

function normalizeTrip(trip: Trip): Trip {
  return {
    ...trip,
    participants: trip.participants || [],
    expenses: trip.expenses || [],
    payments: trip.payments || [],
  };
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => {
      // --- FUNCIONES Y ESTADO PRINCIPAL ---
      const store: ExpenseStore = {
        currentTrip: null,
        trips: [],

        // Trip actions
        createTrip: (name, description) => {
          const newTrip: Trip = {
            id: generateId(),
            name,
            description,
            startDate: new Date(),
            participants: [],
            expenses: [],
            payments: [], // NUEVO
            archived: false,
          };

          set((state) => ({
            trips: [...state.trips, newTrip],
            currentTrip: newTrip,
          }));
        },

        setCurrentTrip: (tripId) => {
          const trip = get().trips.find((t) => t.id === tripId);
          if (trip) {
            set({ currentTrip: normalizeTrip(trip) });
          }
        },

        updateTrip: (tripId, data) => {
          set((state) => ({
            trips: state.trips.map((t) =>
              t.id === tripId ? { ...t, ...data } : t
            ),
            currentTrip:
              state.currentTrip?.id === tripId
                ? { ...state.currentTrip, ...data }
                : state.currentTrip,
          }));
        },

        deleteTrip: (tripId) => {
          set((state) => ({
            trips: state.trips.filter((t) => t.id !== tripId),
            currentTrip:
              state.currentTrip?.id === tripId ? null : state.currentTrip,
          }));
        },

        // PARTICIPANTS -------------------
        addParticipant: (name) => {
          const { currentTrip } = get();
          if (!currentTrip) return;

          const colors = [
            '#EF4444',
            '#10B981',
            '#3B82F6',
            '#8B5CF6',
            '#F59E0B',
            '#EC4899',
            '#06B6D4',
            '#F97316',
          ];

          const newParticipant: Participant = {
            id: generateId(),
            name,
            color:
              colors[currentTrip.participants.length % colors.length],
          };

          const updatedTrip = {
            ...currentTrip,
            participants: [...(currentTrip.participants || []), newParticipant],
          };

          set((state) => ({
            currentTrip: updatedTrip,
            trips: state.trips.map((t) =>
              t.id === currentTrip.id ? updatedTrip : t
            ),
          }));
        },

        removeParticipant: (participantId) => {
          const { currentTrip } = get();
          if (!currentTrip) return;

          const updatedTrip = {
            ...currentTrip,
            participants: (currentTrip.participants || []).filter(
              (p) => p.id !== participantId
            ),
            expenses: (currentTrip.expenses || []).filter(
              (e) =>
                e.paidBy !== participantId &&
                !e.splitBetween.includes(participantId)
            ),
            payments: (currentTrip.payments || []).filter(
              (p) =>
                p.from !== participantId && p.to !== participantId
            ),
          };

          set((state) => ({
            currentTrip: updatedTrip,
            trips: state.trips.map((t) =>
              t.id === currentTrip.id ? updatedTrip : t
            ),
          }));
        },

        updateParticipant: (participantId, data) => {
          const { currentTrip } = get();
          if (!currentTrip) return;

          const updatedTrip = {
            ...currentTrip,
            participants: (currentTrip.participants || []).map((p) =>
              p.id === participantId ? { ...p, ...data } : p
            ),
          };

          set((state) => ({
            currentTrip: updatedTrip,
            trips: state.trips.map((t) =>
              t.id === currentTrip.id ? updatedTrip : t
            ),
          }));
        },

        // EXPENSES -----------------------
        addExpense: (expense) => {
          const { currentTrip } = get();
          if (!currentTrip) return;

          const newExpense: Expense = {
            ...expense,
            id: generateId(),
          };

          const updatedTrip = {
            ...currentTrip,
            expenses: [...(currentTrip.expenses || []), newExpense],
          };

          set((state) => ({
            currentTrip: updatedTrip,
            trips: state.trips.map((t) =>
              t.id === currentTrip.id ? updatedTrip : t
            ),
          }));
        },

        removeExpense: (expenseId) => {
          const { currentTrip } = get();
          if (!currentTrip) return;

          const updatedTrip = {
            ...currentTrip,
            expenses: (currentTrip.expenses || []).filter(
              (e) => e.id !== expenseId
            ),
          };

          set((state) => ({
            currentTrip: updatedTrip,
            trips: state.trips.map((t) =>
              t.id === currentTrip.id ? updatedTrip : t
            ),
          }));
        },

        updateExpense: (expenseId, data) => {
          const { currentTrip } = get();
          if (!currentTrip) return;

          const updatedTrip = {
            ...currentTrip,
            expenses: (currentTrip.expenses || []).map((e) =>
              e.id === expenseId ? { ...e, ...data } : e
            ),
          };

          set((state) => ({
            currentTrip: updatedTrip,
            trips: state.trips.map((t) =>
              t.id === currentTrip.id ? updatedTrip : t
            ),
          }));
        },

        // PAYMENTS -----------------------
        addPayment: (payment) => {
          const { currentTrip } = get();
          if (!currentTrip) return;

          const newPayment: Payment = {
            ...payment,
            id: generateId(),
          };

          const updatedTrip = {
            ...currentTrip,
            payments: [...(currentTrip.payments || []), newPayment],
          };

          set((state) => ({
            currentTrip: updatedTrip,
            trips: state.trips.map((t) =>
              t.id === currentTrip.id ? updatedTrip : t
            ),
          }));
        },

        removePayment: (paymentId) => {
          const { currentTrip } = get();
          if (!currentTrip) return;

          const updatedTrip = {
            ...currentTrip,
            payments: (currentTrip.payments || []).filter(
              (p) => p.id !== paymentId
            ),
          };

          set((state) => ({
            currentTrip: updatedTrip,
            trips: state.trips.map((t) =>
              t.id === currentTrip.id ? updatedTrip : t
            ),
          }));
        },

        // CALCULATIONS -------------------
        getBalances: () => {
          const { currentTrip } = get();
          if (!currentTrip) return [];

          const balances: Record<string, Balance> = {};

          // Inicializar balances
          (currentTrip.participants || []).forEach((p) => {
            balances[p.id] = {
              participantId: p.id,
              totalPaid: 0,
              totalOwed: 0,
              balance: 0,
            };
          });

          // Calcular gastos
          (currentTrip.expenses || []).forEach((expense) => {
            if (balances[expense.paidBy]) {
              balances[expense.paidBy].totalPaid += expense.amount;
            }

            const amountPerPerson = expense.amount / expense.splitBetween.length;
            expense.splitBetween.forEach((participantId) => {
              if (balances[participantId]) {
                balances[participantId].totalOwed += amountPerPerson;
              }
            });
          });

          // Calcular balance base
          Object.values(balances).forEach((b) => {
            b.balance = b.totalPaid - b.totalOwed;
          });

          // Ajustar con pagos
          (currentTrip.payments || []).forEach((payment) => {
            if (balances[payment.from]) {
              balances[payment.from].totalPaid += payment.amount; // suma como si hubiera pagado mas
              balances[payment.from].balance += payment.amount;
            }
            if (balances[payment.to]) {
              balances[payment.to].totalPaid -= payment.amount; // resta como si hubiera pagado menos
              balances[payment.to].balance -= payment.amount;
            }
          });

          return Object.values(balances);
        },

        getSettlements: () => {
          const balances = get().getBalances();
          const settlements: Settlement[] = [];

          const debtors = balances
            .filter((b) => b.balance < 0)
            .map((b) => ({
              id: b.participantId,
              amount: Math.abs(b.balance),
            }));

          const creditors = balances
            .filter((b) => b.balance > 0)
            .map((b) => ({
              id: b.participantId,
              amount: b.balance,
            }));

          let i = 0,
            j = 0;
          while (i < debtors.length && j < creditors.length) {
            const debt = debtors[i].amount;
            const credit = creditors[j].amount;
            const settled = Math.min(debt, credit);

            settlements.push({
              from: debtors[i].id,
              to: creditors[j].id,
              amount: settled,
              paid: false,
            });

            debtors[i].amount -= settled;
            creditors[j].amount -= settled;

            if (debtors[i].amount === 0) i++;
            if (creditors[j].amount === 0) j++;
          }

          return settlements;
        },
      };

      return store;
    },
    {
      name: 'expense-splitter-storage',

      onRehydrateStorage: () => (state, error) => {
        if (error) {
          console.error('Error rehidratando el store:', error);
          return;
        }
        if (!state) return;

        // ✅ Usamos useExpenseStore.setState() para normalizar tras persistencia
        useExpenseStore.setState((s) => ({
          trips: (s.trips || []).map((t) => ({
            ...t,
            participants: t.participants || [],
            expenses: t.expenses || [],
            payments: t.payments || [],
          })),
          currentTrip: s.currentTrip
            ? {
              ...s.currentTrip,
              participants: s.currentTrip.participants || [],
              expenses: s.currentTrip.expenses || [],
              payments: s.currentTrip.payments || [],
            }
            : null,
        }));
      },
    }
  )
);
