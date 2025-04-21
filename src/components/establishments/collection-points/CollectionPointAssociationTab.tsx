
import { useState, useEffect } from "react";
import { useCollectionPoints } from "@/hooks/useCollectionPoints";
import { CollectionPointsTable } from "./CollectionPointsTable";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { toast } from "sonner";
import type { CollectionPoint } from "@/types/collection-point";
import { supabase } from "@/integrations/supabase/client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface CollectionPointAssociationTabProps {
  carrierId: string;
}

export function CollectionPointAssociationTab({ carrierId }: CollectionPointAssociationTabProps) {
  const {
    collectionPoints: unassignedPoints,
    isLoading: isLoadingUnassigned,
    refetch: refetchUnassigned
  } = useCollectionPoints(undefined, undefined, true); // fetch unassigned points

  const {
    collectionPoints: carrierPoints,
    isLoading: isLoadingCarrier,
    refetch: refetchCarrier
  } = useCollectionPoints(undefined, carrierId); // fetch carrier points

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
      refetchUnassigned();
      refetchCarrier();
    } catch (error) {
      console.error('Error associating collection point:', error);
      toast.error('Erro ao associar ponto de coleta');
    }
  };

  const handleDisassociate = async (point: CollectionPoint) => {
    try {
      const { error } = await supabase
        .from('collection_points')
        .update({ carrier_id: null })
        .eq('id', point.id);

      if (error) throw error;
      
      toast.success('Ponto de coleta desassociado com sucesso');
      refetchUnassigned();
      refetchCarrier();
    } catch (error) {
      console.error('Error disassociating collection point:', error);
      toast.error('Erro ao desassociar ponto de coleta');
    }
  };

  const handleRefresh = () => {
    refetchUnassigned();
    refetchCarrier();
  };

  return (
    <Tabs defaultValue="unassigned" className="space-y-6">
      <div className="flex items-center justify-between">
        <TabsList>
          <TabsTrigger value="unassigned">Pontos Disponíveis</TabsTrigger>
          <TabsTrigger value="associated">Pontos Associados</TabsTrigger>
        </TabsList>
        <Button variant="outline" size="sm" onClick={handleRefresh}>
          <RefreshCcw className="h-4 w-4 mr-2" />
          Atualizar
        </Button>
      </div>

      <TabsContent value="unassigned" className="space-y-4">
        <CollectionPointsTable
          collectionPoints={unassignedPoints}
          isLoading={isLoadingUnassigned}
          onAssociate={handleAssociate}
          showAssociateButton
        />
      </TabsContent>

      <TabsContent value="associated" className="space-y-4">
        <CollectionPointsTable
          collectionPoints={carrierPoints}
          isLoading={isLoadingCarrier}
          onDisassociate={handleDisassociate}
          showDisassociateButton
        />
      </TabsContent>
    </Tabs>
  );
}
