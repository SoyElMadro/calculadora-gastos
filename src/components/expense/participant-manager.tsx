'use client';

import { useState } from 'react';
import { useExpenseStore } from '@/store/expense-store';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Card } from '@/components/ui/card';
import { UserPlus, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export function ParticipantManager() {
  const [name, setName] = useState('');
  const { currentTrip, addParticipant, removeParticipant } = useExpenseStore();

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      addParticipant(name);
      setName('');
    }
  };

  if (!currentTrip) return null;

  return (
    <Card className="p-6 glass">
      <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
        <UserPlus className="h-5 w-5 text-primary" />
        Participantes
      </h3>
      
      <form onSubmit={handleAdd} className="flex gap-2 mb-4">
        <Input
          placeholder="Nombre del participante"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="bg-dark-bg border-dark-border"
        />
        <Button type="submit" className="bg-primary hover:bg-primary-dark cursor-pointer">
          Agregar
        </Button>
      </form>

      <div className="space-y-2">
        <AnimatePresence>
          {currentTrip.participants.map((participant, index) => (
            <motion.div
              key={participant.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between p-3 rounded-lg bg-dark-bg hover:bg-dark-surface transition-colors"
            >
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarFallback style={{ backgroundColor: participant.color }}>
                    {participant.name.substring(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <span className="font-medium">{participant.name}</span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeParticipant(participant.id)}
                className="hover:bg-red-500/20 hover:text-red-400 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </Button>
            </motion.div>
          ))}
        </AnimatePresence>
        
        {currentTrip.participants.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Agrega participantes para empezar a dividir gastos
          </p>
        )}
      </div>
    </Card>
  );
}