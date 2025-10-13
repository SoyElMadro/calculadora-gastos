import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat('es-AR', {
    style: 'currency',
    currency: 'ARS',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

export const CATEGORY_ICONS = {
  food: '🍕',
  transport: '🚗',
  accommodation: '🏠',
  entertainment: '🎉',
  other: '📌',
};

export const CATEGORY_LABELS = {
  food: 'Comida',
  transport: 'Transporte',
  accommodation: 'Alojamiento',
  entertainment: 'Entretenimiento',
  other: 'Otros',
};

export const AVATAR_COLORS = [
  '#EF4444', // red
  '#F59E0B', // amber
  '#10B981', // green
  '#3B82F6', // blue
  '#8B5CF6', // purple
  '#EC4899', // pink
  '#06B6D4', // cyan
  '#F97316', // orange
];