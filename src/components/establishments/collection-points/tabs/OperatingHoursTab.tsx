
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Trash2 } from "lucide-react";
import type { CollectionPoint, DayOfWeek } from "@/types/collection-point";
import { daysOfWeek, daysOfWeekPtBr } from "@/types/collection-point";
import { ScrollArea } from "@/components/ui/scroll-area";

interface OperatingHoursTabProps {
  form: Partial<CollectionPoint>;
  onTimeChange: (day: DayOfWeek, index: number, field: 'open' | 'close', value: string) => void;
  onAddTimePeriod: (day: DayOfWeek) => void;
  onRemoveTimePeriod: (day: DayOfWeek, index: number) => void;
  isLoading?: boolean;
}

export function OperatingHoursTab({
  form,
  onTimeChange,
  onAddTimePeriod,
  onRemoveTimePeriod,
  isLoading
}: OperatingHoursTabProps) {
  return (
    <ScrollArea className="h-[300px] pr-4">
      <div className="space-y-4">
        {daysOfWeek.map(day => (
          <div key={day} className="border-b pb-3 last:border-b-0">
            <div className="flex justify-between items-center mb-2">
              <h3 className="font-medium">{daysOfWeekPtBr[day]}</h3>
              <Button 
                type="button" 
                variant="outline" 
                size="sm"
                onClick={() => onAddTimePeriod(day)}
                disabled={isLoading}
              >
                Adicionar Horário
              </Button>
            </div>
            
            {(!form.operating_hours?.[day] || form.operating_hours[day].length === 0) ? (
              <p className="text-muted-foreground text-sm">Fechado neste dia</p>
            ) : (
              <div className="space-y-2">
                {form.operating_hours[day].map((period, index) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input 
                      type="time"
                      value={period.open}
                      onChange={(e) => onTimeChange(day, index, 'open', e.target.value)}
                      className="w-32"
                      disabled={isLoading}
                    />
                    <span>até</span>
                    <Input 
                      type="time"
                      value={period.close}
                      onChange={(e) => onTimeChange(day, index, 'close', e.target.value)}
                      className="w-32"
                      disabled={isLoading}
                    />
                    <Button 
                      type="button"
                      variant="ghost" 
                      size="icon"
                      onClick={() => onRemoveTimePeriod(day, index)}
                      disabled={isLoading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}
