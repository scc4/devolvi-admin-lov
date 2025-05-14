
import React from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Plus, Minus, Clock } from "lucide-react";
import { daysOfWeek, daysOfWeekPtBr, DayOfWeek } from "@/types/collection-point";
import type { CollectionPoint } from "@/types/collection-point";

interface OperatingHoursTabV2Props {
  form: Partial<CollectionPoint>;
  onTimeChange: (day: DayOfWeek, index: number, field: 'open' | 'close', value: string) => void;
  onAddTimePeriod: (day: DayOfWeek) => void;
  onRemoveTimePeriod: (day: DayOfWeek, index: number) => void;
  isLoading?: boolean;
}

export function OperatingHoursTabV2({
  form,
  onTimeChange,
  onAddTimePeriod,
  onRemoveTimePeriod,
  isLoading
}: OperatingHoursTabV2Props) {
  const hours = form.operating_hours || {};

  return (
    <div className="space-y-6">
      {daysOfWeek.map((day) => (
        <div key={day} className="border p-4 rounded-lg">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-medium">{daysOfWeekPtBr[day]}</h3>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => onAddTimePeriod(day)}
              disabled={isLoading}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              <span>Adicionar Horário</span>
            </Button>
          </div>

          {hours[day]?.length ? (
            hours[day].map((period, index) => (
              <div key={index} className="flex flex-wrap items-center gap-2 mb-2">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>De</span>
                  <Input
                    type="time"
                    value={period.open}
                    onChange={(e) => onTimeChange(day, index, 'open', e.target.value)}
                    className="w-32"
                    disabled={isLoading}
                  />
                  <span>às</span>
                  <Input
                    type="time"
                    value={period.close}
                    onChange={(e) => onTimeChange(day, index, 'close', e.target.value)}
                    className="w-32"
                    disabled={isLoading}
                  />
                </div>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => onRemoveTimePeriod(day, index)}
                  disabled={isLoading}
                >
                  <Minus className="h-4 w-4" />
                  <span className="sr-only">Remover período</span>
                </Button>
              </div>
            ))
          ) : (
            <div className="text-gray-500 italic">Fechado</div>
          )}
        </div>
      ))}
    </div>
  );
}
