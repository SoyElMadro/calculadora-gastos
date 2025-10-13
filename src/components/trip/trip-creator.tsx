'use client';

import { useState } from 'react';
import { useExpenseStore } from '@/store/expense-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';

export function TripCreator() {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const createTrip = useExpenseStore((state) => state.createTrip);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      createTrip(name, description);
      setName('');
      setDescription('');
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary hover:bg-primary-dark cursor-pointer">
          <PlusCircle className="mr-2 h-4 w-4" />
          Nuevo Evento
        </Button>
      </DialogTrigger>
      <DialogContent className="bg-dark-surface border-dark-border">
        <DialogHeader>
          <DialogTitle className="text-2xl gradient-text">
            Crear Nuevo Evento
          </DialogTitle>
          <DialogDescription>
            Empieza a dividir gastos con tus amigos
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nombre del evento</Label>
            <Input
              id="name"
              placeholder="Ej: Bariloche 2025"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="bg-dark-bg border-dark-border"
              required
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="description">Descripción (opcional)</Label>
            <Input
              id="description"
              placeholder="Fin de semana en la montaña"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="bg-dark-bg border-dark-border"
            />
          </div>
          <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
            Crear Evento
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}