
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { PencilIcon, Trash2, Check, X, Clock, MapPin, Phone } from "lucide-react";
import { CollectionPoint, DayOfWeek, daysOfWeek, daysOfWeekPtBr } from "@/types/collection-point";
import { useIsMobile } from "@/hooks/use-mobile";

interface CollectionPointsTableProps {
  collectionPoints: CollectionPoint[];
  isLoading: boolean;
  onEdit: (point: CollectionPoint) => void;
  onDelete: (pointId: string) => void;
}

export function CollectionPointsTable({
  collectionPoints,
  isLoading,
  onEdit,
  onDelete,
}: CollectionPointsTableProps) {
  const { isMobile } = useIsMobile();
  
  const formatOperatingHours = (hours: CollectionPoint['operating_hours']) => {
    if (!hours) return "Não informado";
    
    return Object.entries(hours)
      .map(([day, periods]) => {
        const dayName = daysOfWeekPtBr[day as DayOfWeek];
        if (!periods || periods.length === 0) return `${dayName}: Fechado`;
        
        const timeRanges = periods.map(p => `${p.open} - ${p.close}`).join(', ');
        return `${dayName}: ${timeRanges}`;
      })
      .join('\n');
  };

  const formatAddress = (point: CollectionPoint) => {
    const parts = [];
    if (point.street) parts.push(point.street);
    if (point.number) parts.push(point.number);
    if (point.complement) parts.push(point.complement);
    if (point.district) parts.push(point.district);
    if (point.zip_code) parts.push(`CEP: ${point.zip_code}`);
    if (point.city) parts.push(point.city);
    if (point.state) parts.push(point.state);
    
    return parts.length > 0 ? parts.join(', ') : point.address || "Não informado";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }

  if (collectionPoints.length === 0) {
    return (
      <div className="text-center p-8 border rounded-md">
        <p className="text-muted-foreground">Nenhum ponto de coleta cadastrado</p>
      </div>
    );
  }

  // Mobile view for collection points
  if (isMobile) {
    return (
      <div className="space-y-4">
        {collectionPoints.map((point) => (
          <div key={point.id} className="border rounded-md p-4 space-y-3">
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
                <PencilIcon className="h-3 w-3 mr-1" /> Editar
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
        ))}
      </div>
    );
  }

  // Desktop view
  return (
    <div className="border rounded-md overflow-hidden">
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Nome</TableHead>
              <TableHead>Telefone</TableHead>
              <TableHead>Endereço</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Horário de Funcionamento</TableHead>
              <TableHead className="w-[100px]"></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {collectionPoints.map((point) => (
              <TableRow key={point.id}>
                <TableCell>{point.name}</TableCell>
                <TableCell>
                  {point.phone ? (
                    <div className="flex items-center gap-1">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{point.phone}</span>
                    </div>
                  ) : (
                    "Não informado"
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-1">
                    <MapPin className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span>{formatAddress(point)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  {point.is_active ? (
                    <div className="flex items-center gap-1">
                      <Check className="h-4 w-4 text-green-500" />
                      <span>Ativo</span>
                    </div>
                  ) : (
                    <div className="flex items-center gap-1">
                      <X className="h-4 w-4 text-destructive" />
                      <span>Inativo</span>
                    </div>
                  )}
                </TableCell>
                <TableCell>
                  <div className="flex items-start gap-1">
                    <Clock className="h-4 w-4 text-muted-foreground shrink-0 mt-0.5" />
                    <span className="whitespace-pre-line">{formatOperatingHours(point.operating_hours)}</span>
                  </div>
                </TableCell>
                <TableCell>
                  <div className="flex justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onEdit(point)}
                    >
                      <PencilIcon className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => onDelete(point.id)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
