import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Participant, Expense, Settlement, Balance, Trip } from '@/types';
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
  
  // Payment actions
  addPayment: (from: string, to: string, amount: number) => void;
  removePayment: (from: string, to: string) => void;
  getPaymentAmount: (from: string, to: string) => number;
  
  // Calculations
  getBalances: () => Balance[];
  getSettlements: () => Settlement[];
  markSettlementAsPaid: (from: string, to: string) => void;
}

export const useExpenseStore = create<ExpenseStore>()(
  persist(
    (set, get) => ({
      currentTrip: null,
      trips: [],
      
      createTrip: (name, description) => {
        const newTrip: Trip = {
          id: generateId(),
          name,
          description,
          startDate: new Date(),
          participants: [],
          expenses: [],
          payments: {}, // Agregar objeto de pagos
          archived: false,
        };
        
        set((state) => ({
          trips: [...state.trips, newTrip],
          currentTrip: newTrip,
        }));
      },
      
      setCurrentTrip: (tripId) => {
        const trip = get().trips.find(t => t.id === tripId);
        if (trip) {
          set({ currentTrip: trip });
        }
      },
      
      updateTrip: (tripId, data) => {
        set((state) => ({
          trips: state.trips.map(t => t.id === tripId ? { ...t, ...data } : t),
          currentTrip: state.currentTrip?.id === tripId 
            ? { ...state.currentTrip, ...data } 
            : state.currentTrip,
        }));
      },
      
      deleteTrip: (tripId) => {
        set((state) => ({
          trips: state.trips.filter(t => t.id !== tripId),
          currentTrip: state.currentTrip?.id === tripId ? null : state.currentTrip,
        }));
      },
      
      addParticipant: (name) => {
        const { currentTrip } = get();
        if (!currentTrip) return;
        
        const newParticipant: Participant = {
          id: generateId(),
          name,
          color: ['#EF4444', '#10B981', '#3B82F6', '#8B5CF6', '#F59E0B'][
            currentTrip.participants.length % 5
          ],
        };
        
        const updatedTrip = {
          ...currentTrip,
          participants: [...currentTrip.participants, newParticipant],
        };
        
        set((state) => ({
          currentTrip: updatedTrip,
          trips: state.trips.map(t => t.id === currentTrip.id ? updatedTrip : t),
        }));
      },
      
      removeParticipant: (participantId) => {
        const { currentTrip } = get();
        if (!currentTrip) return;
        
        const updatedTrip = {
          ...currentTrip,
          participants: currentTrip.participants.filter(p => p.id !== participantId),
          expenses: currentTrip.expenses.filter(e => 
            e.paidBy !== participantId && 
            !e.splitBetween.includes(participantId)
          ),
        };
        
        set((state) => ({
          currentTrip: updatedTrip,
          trips: state.trips.map(t => t.id === currentTrip.id ? updatedTrip : t),
        }));
      },
      
      updateParticipant: (participantId, data) => {
        const { currentTrip } = get();
        if (!currentTrip) return;
        
        const updatedTrip = {
          ...currentTrip,
          participants: currentTrip.participants.map(p => 
            p.id === participantId ? { ...p, ...data } : p
          ),
        };
        
        set((state) => ({
          currentTrip: updatedTrip,
          trips: state.trips.map(t => t.id === currentTrip.id ? updatedTrip : t),
        }));
      },
      
      addExpense: (expense) => {
        const { currentTrip } = get();
        if (!currentTrip) return;
        
        const newExpense: Expense = {
          ...expense,
          id: generateId(),
        };
        
        const updatedTrip = {
          ...currentTrip,
          expenses: [...currentTrip.expenses, newExpense],
        };
        
        set((state) => ({
          currentTrip: updatedTrip,
          trips: state.trips.map(t => t.id === currentTrip.id ? updatedTrip : t),
        }));
      },
      
      removeExpense: (expenseId) => {
        const { currentTrip } = get();
        if (!currentTrip) return;
        
        const updatedTrip = {
          ...currentTrip,
          expenses: currentTrip.expenses.filter(e => e.id !== expenseId),
        };
        
        set((state) => ({
          currentTrip: updatedTrip,
          trips: state.trips.map(t => t.id === currentTrip.id ? updatedTrip : t),
        }));
      },
      
      updateExpense: (expenseId, data) => {
        const { currentTrip } = get();
        if (!currentTrip) return;
        
        const updatedTrip = {
          ...currentTrip,
          expenses: currentTrip.expenses.map(e => 
            e.id === expenseId ? { ...e, ...data } : e
          ),
        };
        
        set((state) => ({
          currentTrip: updatedTrip,
          trips: state.trips.map(t => t.id === currentTrip.id ? updatedTrip : t),
        }));
      },
      
      // Nueva función: Agregar o actualizar un pago
      addPayment: (from, to, amount) => {
        const { currentTrip } = get();
        if (!currentTrip) return;
        
        const paymentKey = `${from}-${to}`;
        const currentPayments = currentTrip.payments || {};
        const currentAmount = currentPayments[paymentKey] || 0;
        
        const updatedTrip = {
          ...currentTrip,
          payments: {
            ...currentPayments,
            [paymentKey]: currentAmount + amount,
          },
        };
        
        set((state) => ({
          currentTrip: updatedTrip,
          trips: state.trips.map(t => t.id === currentTrip.id ? updatedTrip : t),
        }));
      },
      
      // Nueva función: Remover un pago
      removePayment: (from, to) => {
        const { currentTrip } = get();
        if (!currentTrip) return;
        
        const paymentKey = `${from}-${to}`;
        const currentPayments = currentTrip.payments || {};
        const { [paymentKey]: _, ...remainingPayments } = currentPayments;
        
        const updatedTrip = {
          ...currentTrip,
          payments: remainingPayments,
        };
        
        set((state) => ({
          currentTrip: updatedTrip,
          trips: state.trips.map(t => t.id === currentTrip.id ? updatedTrip : t),
        }));
      },
      
      // Nueva función: Obtener monto pagado
      getPaymentAmount: (from, to) => {
        const { currentTrip } = get();
        if (!currentTrip) return 0;
        
        const paymentKey = `${from}-${to}`;
        return currentTrip.payments?.[paymentKey] || 0;
      },
      
      getBalances: () => {
        const { currentTrip } = get();
        if (!currentTrip) return [];
        
        const balances: Record<string, Balance> = {};
        
        // Initialize balances
        currentTrip.participants.forEach(p => {
          balances[p.id] = {
            participantId: p.id,
            totalPaid: 0,
            totalOwed: 0,
            balance: 0,
          };
        });
        
        // Calculate balances
        currentTrip.expenses.forEach(expense => {
          // Add to totalPaid for the payer
          if (balances[expense.paidBy]) {
            balances[expense.paidBy].totalPaid += expense.amount;
          }
          
          // Distribute owed amount
          const amountPerPerson = expense.amount / expense.splitBetween.length;
          expense.splitBetween.forEach(participantId => {
            if (balances[participantId]) {
              balances[participantId].totalOwed += amountPerPerson;
            }
          });
        });
        
        // Calculate final balance
        Object.values(balances).forEach(balance => {
          balance.balance = balance.totalPaid - balance.totalOwed;
        });
        
        return Object.values(balances);
      },
      
      getSettlements: () => {
        const balances = get().getBalances();
        const settlements: Settlement[] = [];
        
        // Separate debtors and creditors
        const debtors = balances.filter(b => b.balance < 0).map(b => ({
          id: b.participantId,
          amount: Math.abs(b.balance),
        }));
        
        const creditors = balances.filter(b => b.balance > 0).map(b => ({
          id: b.participantId,
          amount: b.balance,
        }));
        
        // Greedy algorithm to minimize transactions
        let i = 0, j = 0;
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
      
      markSettlementAsPaid: (from, to) => {
        // This would be implemented when we add settlement tracking
        console.log(`Marked settlement from ${from} to ${to} as paid`);
      },
    }),
    {
      name: 'expense-splitter-storage',
    }
  )
);