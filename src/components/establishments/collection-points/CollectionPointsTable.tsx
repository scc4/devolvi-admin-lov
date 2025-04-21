
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

  return (
    <div className="border rounded-md overflow-hidden">
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
  );
}
