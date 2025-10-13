export interface Participant {
  id: string;
  name: string;
  avatar?: string;
  color: string;
}

export interface Expense {
  id: string;
  description: string;
  amount: number;
  paidBy: string; // participant id
  splitBetween: string[]; // participant ids
  date: Date;
  category: 'food' | 'transport' | 'accommodation' | 'entertainment' | 'other';
  receiptUrl?: string;
}

export interface Payment {
  id: string;
  from: string; // participant id
  to: string; // participant id
  amount: number;
  date: Date;
  note?: string;
}

export interface Settlement {
  from: string;
  to: string;
  amount: number;
  paid: boolean;
}

export interface Trip {
  id: string;
  name: string;
  description?: string;
  startDate: Date;
  endDate?: Date;
  participants: Participant[];
  expenses: Expense[];
  payments: Payment[];
  archived: boolean;
}

export interface Balance {
  participantId: string;
  totalPaid: number;
  totalOwed: number;
  balance: number; // positivo = le deben plata, negativo = debe plata
}