
import { Checkbox } from "@/components/ui/checkbox";
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
  const handleDayToggle = (day: DayOfWeek) => {
    if (!form.operating_hours?.[day] || form.operating_hours[day].length === 0) {
      onAddTimePeriod(day);
    } else {
      onRemoveTimePeriod(day, 0);
    }
  };

  const isDayOpen = (day: DayOfWeek) => {
    return form.operating_hours?.[day]?.length > 0;
  };

  return (
    <ScrollArea className="h-[400px] pr-4">
      <div className="space-y-6">
        <h3 className="text-lg font-medium">Configurar horário de funcionamento padrão</h3>
        
        <div className="space-y-4">
          {daysOfWeek.map(day => (
            <div key={day} className="flex items-center gap-4">
              <div className="w-32">
                <span className="font-medium">{daysOfWeekPtBr[day]}</span>
              </div>
              
              <Checkbox
                checked={isDayOpen(day)}
                onCheckedChange={() => handleDayToggle(day)}
                disabled={isLoading}
              />
              
              <span className="min-w-16">
                {isDayOpen(day) ? 'Aberto' : 'Fechado'}
              </span>

              {isDayOpen(day) && form.operating_hours?.[day]?.[0] && (
                <div className="flex items-center gap-2">
                  <input
                    type="time"
                    value={form.operating_hours[day][0].open}
                    onChange={(e) => onTimeChange(day, 0, 'open', e.target.value)}
                    className="px-2 py-1 border rounded"
                    disabled={isLoading}
                  />
                  <span>até</span>
                  <input
                    type="time"
                    value={form.operating_hours[day][0].close}
                    onChange={(e) => onTimeChange(day, 0, 'close', e.target.value)}
                    className="px-2 py-1 border rounded"
                    disabled={isLoading}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </ScrollArea>
  );
}
