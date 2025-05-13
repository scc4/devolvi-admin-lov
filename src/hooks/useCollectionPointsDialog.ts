
import { useState, useEffect, useRef } from "react";
import { useToast } from "./use-toast";

interface UseCollectionPointsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  establishmentId?: string;
  establishmentName?: string;
  carrierId?: string;
  carrierName?: string;
}

export function useCollectionPointsDialog({
  open,
  onOpenChange,
  establishmentId,
  establishmentName,
  carrierId,
  carrierName
}: UseCollectionPointsDialogProps) {
  const { toast } = useToast();
  const dialogMountedRef = useRef(false);
  const dialogStableRef = useRef(false);
  const timeoutRef = useRef<number | null>(null);

  // Additional state to ensure stable dialog
  const [isStable, setIsStable] = useState(false);
  
  // Determine dialog type for UI customization
  const isCarrierDialog = !!carrierId;
  const isEstablishmentDialog = !!establishmentId;
  
  // Generate appropriate title and description
  const title = isCarrierDialog 
    ? `Pontos de Coleta - ${carrierName}`
    : isEstablishmentDialog 
      ? `Pontos de Coleta - ${establishmentName}`
      : "Pontos de Coleta";
  
  const description = isCarrierDialog
    ? "Gerencie os pontos de coleta associados a esta transportadora."
    : "Gerencie os pontos de coleta.";

  // Proper cleanup on unmount
  useEffect(() => {
    // When dialog opens
    if (open) {
      dialogMountedRef.current = true;
      
      // Delay setting stability to ensure proper mounting
      timeoutRef.current = window.setTimeout(() => {
        dialogStableRef.current = true;
        setIsStable(true);
      }, 300);
    } 
    // When dialog closes
    else {
      // Reset stability immediately
      setIsStable(false);
      dialogStableRef.current = false;
      
      // Delay resetting mounted state to allow animations
      timeoutRef.current = window.setTimeout(() => {
        dialogMountedRef.current = false;
      }, 300);
    }
    
    // Cleanup function
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
      document.body.style.pointerEvents = '';
      document.body.style.overflow = '';
    };
  }, [open]);

  // Handle unexpected errors
  const handleDialogError = (error: any) => {
    console.error("Collection points dialog error:", error);
    toast({
      title: "Erro no carregamento",
      description: "Ocorreu um erro ao carregar os pontos de coleta. Tente novamente.",
      variant: "destructive"
    });
  };

  return {
    isCarrierDialog,
    isEstablishmentDialog,
    title,
    description,
    isStable,
    dialogMountedRef,
    handleDialogError
  };
}
