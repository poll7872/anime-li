"use client";

import * as React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { cn } from '@/lib/utils';

export type AnimeStatus = 'watching' | 'completed' | 'plan_to_watch';

const statusConfig = {
  watching: {
    label: 'Viendo',
    className: 'bg-blue-500/20 text-blue-300 border-blue-500/30 hover:bg-blue-500/30',
  },
  completed: {
    label: 'Completado',
    className: 'bg-pink-500/20 text-pink-300 border-pink-500/30 hover:bg-pink-500/30',
  },
  plan_to_watch: {
    label: 'Pendiente',
    className: 'bg-zinc-500/20 text-zinc-300 border-zinc-500/30 hover:bg-zinc-500/30',
  },
};

export function StatusSelect({ value, onChange }: { value: AnimeStatus; onChange: (newStatus: AnimeStatus) => void; }) {
  const currentStatus = value && statusConfig[value] ? value : 'plan_to_watch';

  return (
    <Select value={currentStatus} onValueChange={(v) => onChange(v as AnimeStatus)}>
      <SelectTrigger className={cn('w-36 font-semibold transition-colors duration-300', statusConfig[currentStatus].className)}>
        <SelectValue placeholder="Selecciona estado" />
      </SelectTrigger>
      <SelectContent className="bg-zinc-900 text-white border-zinc-700">
        {Object.entries(statusConfig).map(([key, { label }]) => (
          <SelectItem key={key} value={key} className="hover:bg-pink-500/20 focus:bg-pink-500/20">
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
