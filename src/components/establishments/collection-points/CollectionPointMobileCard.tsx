
import { Check, X, MapPin, Phone, Pencil, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { CollectionPoint } from "@/types/collection-point";
import { formatAddress, formatOperatingHours } from "./utils/formatters";

interface CollectionPointMobileCardProps {
  point: CollectionPoint;
  onEdit: (point: CollectionPoint) => void;
  onDelete: (pointId: string) => void;
}

export function CollectionPointMobileCard({ point, onEdit, onDelete }: CollectionPointMobileCardProps) {
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
        <span className="flex-1">{formatAddress(point)}</span>
      </div>
      
      <div className="border-t pt-2 mt-2">
        <p className="text-xs font-medium mb-1">Horário de Funcionamento:</p>
        <div className="text-xs whitespace-pre-line">{formatOperatingHours(point.operating_hours)}</div>
      </div>
      
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
