
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal, PencilIcon, Trash2, Link } from "lucide-react";
import type { CollectionPoint } from "@/types/collection-point";
import type { Carrier } from "@/types/carrier";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useState } from "react";
import { useCarriers } from "@/hooks/useCarriers";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "sonner";

interface CollectionPointActionsDropdownProps {
  point: CollectionPoint;
  onEdit: (point: CollectionPoint) => void;
  onDelete: (pointId: string) => void;
  onAssignCarrier: (pointId: string, carrierId: string | null) => Promise<void>;
}

export function CollectionPointActionsDropdown({
  point,
  onEdit,
  onDelete,
  onAssignCarrier,
}: CollectionPointActionsDropdownProps) {
  const [isCarrierDialogOpen, setIsCarrierDialogOpen] = useState(false);
  const { carriers, loading: loadingCarriers } = useCarriers();

  const handleAssignCarrier = async (carrier: Carrier) => {
    try {
      await onAssignCarrier(point.id, carrier.id);
      setIsCarrierDialogOpen(false);
      toast.success("Transportadora associada com sucesso");
    } catch (error) {
      console.error("Error assigning carrier:", error);
      toast.error("Erro ao associar transportadora");
    }
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="icon">
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => onEdit(point)}>
            <PencilIcon className="h-4 w-4 mr-2" />
            Editar
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setIsCarrierDialogOpen(true)}>
            <Link className="h-4 w-4 mr-2" />
            Associar Transportadora
          </DropdownMenuItem>
          <DropdownMenuItem
            className="text-destructive"
            onClick={() => onDelete(point.id)}
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Excluir
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <Dialog open={isCarrierDialogOpen} onOpenChange={setIsCarrierDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Associar Transportadora</DialogTitle>
          </DialogHeader>
          
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {loadingCarriers ? (
                <p className="text-center py-4">Carregando transportadoras...</p>
              ) : carriers.length === 0 ? (
                <p className="text-center py-4">Nenhuma transportadora encontrada</p>
              ) : (
                carriers.map((carrier) => (
                  <Button
                    key={carrier.id}
                    variant="outline"
                    className="w-full justify-start"
                    onClick={() => handleAssignCarrier(carrier)}
                  >
                    {carrier.name}
                  </Button>
                ))
              )}
            </div>
          </ScrollArea>

          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsCarrierDialogOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
