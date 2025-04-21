
import type { CollectionPoint } from "@/types/collection-point";
import { useIsMobile } from "@/hooks/use-mobile";
import { CollectionPointMobileCard } from "./CollectionPointMobileCard";
import { CollectionPointDesktopTable } from "./CollectionPointDesktopTable";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();

  const handleAssignCarrier = async (pointId: string, carrierId: string | null) => {
    try {
      const { error } = await supabase
        .from('collection_points')
        .update({ carrier_id: carrierId })
        .eq('id', pointId);

      if (error) throw error;
      
      toast({
        title: "Transportadora atribuída com sucesso",
        variant: "default"
      });
    } catch (error) {
      console.error("Error assigning carrier:", error);
      toast({
        title: "Erro ao atribuir transportadora",
        description: "Não foi possível atribuir a transportadora. Por favor, tente novamente.",
        variant: "destructive"
      });
    }
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
      <div className="text-center p-8 border rounded-md bg-slate-50">
        <p className="text-muted-foreground">Nenhum ponto de coleta cadastrado</p>
      </div>
    );
  }

  if (isMobile) {
    return (
      <div className="space-y-4">
        {collectionPoints.map((point) => (
          <CollectionPointMobileCard
            key={point.id}
            point={point}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg border shadow-sm overflow-hidden">
      <CollectionPointDesktopTable
        collectionPoints={collectionPoints}
        onEdit={onEdit}
        onDelete={onDelete}
        onAssignCarrier={handleAssignCarrier}
      />
    </div>
  );
}
