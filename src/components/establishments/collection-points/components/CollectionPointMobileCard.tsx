
import { Check, X, MapPin, Phone, Pencil, Trash2, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CollectionPoint } from "@/types/collection-point";
import { formatAddress } from "../utils/formatters";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useState } from "react";
import { daysOfWeek, daysOfWeekPtBr, DayOfWeek } from "@/types/collection-point";
import { getSimpleAddress } from "../utils/addressHelpers";

interface CollectionPointMobileCardProps {
  point: CollectionPoint;
  onEdit: (point: CollectionPoint) => void;
  onDelete: (pointId: string) => void;
  carrierName?: string;
}

export function CollectionPointMobileCard({ 
  point, 
  onEdit, 
  onDelete,
  carrierName
}: CollectionPointMobileCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  const formatOperatingHoursSimple = () => {
    if (!point.operating_hours) return "Horários não informados";
    
    // Find if the point is currently open
    const now = new Date();
    const today = daysOfWeek[now.getDay()];
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const todayHours = point.operating_hours[today];
    const isOpen = todayHours?.some(period => period.open <= currentTime && period.close >= currentTime);
    
    if (isOpen) {
      const closingTime = todayHours.find(period => period.close >= currentTime)?.close;
      return `Aberto • Fecha às ${closingTime}`;
    }
    return "Fechado";
  };

  return (
    <div className="border rounded-md p-4 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">{point.name}</h3>
        {point.is_active ? (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
            <Check className="h-3 w-3 mr-1" />
            Ativo
          </span>
        ) : (
          <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-red-100 text-red-800">
            <X className="h-3 w-3 mr-1" />
            Inativo
          </span>
        )}
      </div>
      
      {point.phone && (
        <div className="flex items-center text-sm">
          <Phone className="h-4 w-4 text-muted-foreground mr-1" />
          <span>{point.phone}</span>
        </div>
      )}
      
      <div className="flex items-start text-sm">
        <MapPin className="h-4 w-4 text-muted-foreground mr-1 mt-0.5" />
        <span className="flex-1">{getSimpleAddress(point)}</span>
      </div>

      {carrierName && (
        <div className="text-sm font-medium text-muted-foreground">
          Transportadora: {carrierName}
        </div>
      )}

      <Collapsible open={isOpen} onOpenChange={setIsOpen}>
        <div className="flex items-center justify-between pt-2 border-t">
          <span className="text-sm">{formatOperatingHoursSimple()}</span>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm">
              <ChevronDown className={`h-4 w-4 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
            </Button>
          </CollapsibleTrigger>
        </div>

        <CollapsibleContent className="pt-2">
          <div className="space-y-1">
            {daysOfWeek.map((day) => {
              const hours = point.operating_hours?.[day];
              return (
                <div key={day} className="flex justify-between text-sm">
                  <span className="font-medium">{daysOfWeekPtBr[day as DayOfWeek]}</span>
                  <span>
                    {hours && hours.length > 0
                      ? hours.map(period => `${period.open} - ${period.close}`).join(', ')
                      : 'Fechado'}
                  </span>
                </div>
              );
            })}
          </div>
        </CollapsibleContent>
      </Collapsible>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onEdit(point)}
        >
          <Pencil className="h-3 w-3 mr-1" /> Editar
        </Button>
        <Button
          variant="outline"
          size="sm"
          className="text-destructive border-destructive hover:bg-destructive/10"
          onClick={() => onDelete(point.id)}
        >
          <Trash2 className="h-3 w-3 mr-1" /> Excluir
        </Button>
      </div>
    </div>
  );
}
