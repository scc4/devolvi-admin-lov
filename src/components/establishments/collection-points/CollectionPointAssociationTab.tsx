
import { useState, useEffect } from "react";
import { useCollectionPoints } from "@/hooks/useCollectionPoints";
import { CollectionPointsTable } from "./CollectionPointsTable";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import type { CollectionPoint } from "@/types/collection-point";
import { supabase } from "@/integrations/supabase/client";

interface CollectionPointAssociationTabProps {
  carrierId: string;
}

export function CollectionPointAssociationTab({ carrierId }: CollectionPointAssociationTabProps) {
  const {
    collectionPoints,
    isLoading,
    refetch
  } = useCollectionPoints(undefined, undefined, true); // true means fetch unassigned points

  // Ensure proper cleanup on unmount
  useEffect(() => {
    return () => {
      // Clear any lingering portal elements on unmount
      document.body.style.pointerEvents = '';
      const overlays = document.querySelectorAll('[data-radix-portal]');
      overlays.forEach(overlay => {
        if (!overlay.contains(document.activeElement)) {
          (overlay as HTMLElement).style.display = 'none';
        }
      });
    };
  }, []);

  const handleAssociate = async (point: CollectionPoint) => {
    try {
      const { error } = await supabase
        .from('collection_points')
        .update({ carrier_id: carrierId })
        .eq('id', point.id);

      if (error) throw error;
      
      toast.success('Ponto de coleta associado com sucesso');
      refetch();
    } catch (error) {
      console.error('Error associating collection point:', error);
      toast.error('Erro ao associar ponto de coleta');
    }
  };

  const UnassignedPointsTable = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Pontos de Coleta Disponíveis</h2>
        <Button variant="outline" size="sm" onClick={() => refetch()}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <CollectionPointsTable
        collectionPoints={collectionPoints}
        isLoading={isLoading}
        onAssociate={handleAssociate}
        showAssociateButton
      />
    </div>
  );

  return (
    <div className="space-y-6">
      <UnassignedPointsTable />
    </div>
  );
}
