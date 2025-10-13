'use client';

import { useExpenseStore } from '@/store/expense-store';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowLeft, MoreVertical, Archive, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

interface TripHeaderProps {
  onBack: () => void;
}

export function TripHeader({ onBack }: TripHeaderProps) {
  const { currentTrip, updateTrip, deleteTrip } = useExpenseStore();

  if (!currentTrip) return null;

  const handleArchive = () => {
    if (confirm(`¿Archivar "${currentTrip.name}"?`)) {
      updateTrip(currentTrip.id, { archived: !currentTrip.archived });
    }
  };

  const handleDelete = () => {
    if (
      confirm(
        `¿Eliminar "${currentTrip.name}" permanentemente? Esta acción no se puede deshacer.`
      )
    ) {
      deleteTrip(currentTrip.id);
      onBack();
    }
  };

  return (
    <div className="flex items-start justify-between gap-4 flex-wrap">
      <div className="flex items-start gap-4 flex-1 min-w-0">
        <Button
          variant="ghost"
          size="icon"
          onClick={onBack}
          className="mt-1 hover:bg-primary/10 hover:text-primary"
        >
          <ArrowLeft className="h-5 w-5" />
        </Button>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h2 className="text-3xl md:text-4xl font-bold truncate gradient-text">
              {currentTrip.name}
            </h2>
            {currentTrip.archived && (
              <Badge variant="outline" className="text-xs">
                <Archive className="h-3 w-3 mr-1" />
                Archivado
              </Badge>
            )}
          </div>

          {currentTrip.description && (
            <p className="text-muted-foreground mb-2">
              {currentTrip.description}
            </p>
          )}

          <p className="text-sm text-muted-foreground">
            Creado el{' '}
            {format(new Date(currentTrip.startDate), "d 'de' MMMM 'de' yyyy", {
              locale: es,
            })}
          </p>
        </div>
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreVertical className="h-5 w-5" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align="end"
          className="bg-dark-surface border-dark-border"
        >
          <DropdownMenuItem
            onClick={handleArchive}
            className="cursor-pointer"
          >
            <Archive className="h-4 w-4 mr-2" />
            {currentTrip.archived ? 'Desarchivar' : 'Archivar'}
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            onClick={handleDelete}
            className="cursor-pointer text-red-400 focus:text-red-400"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Eliminar viaje
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}