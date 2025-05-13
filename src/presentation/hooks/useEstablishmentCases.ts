
import { useState, useCallback, useEffect, useRef } from 'react';
import { toast } from "sonner";
import { container } from '../../infrastructure/di/container';
import { establishmentAdapter } from '../../adapters/establishments/establishmentAdapter';
import { EstablishmentWithDetails } from '../../types/establishment';

/**
 * Hook to expose establishment-related use cases to the presentation layer using DI
 */
export function useEstablishmentCases() {
  const [establishments, setEstablishments] = useState<EstablishmentWithDetails[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isCreating, setIsCreating] = useState<boolean>(false);
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [isDeleting, setIsDeleting] = useState<boolean>(false);
  
  // Flag para controlar se o componente está montado
  const isMountedRef = useRef(true);
  const hasInitialLoadRef = useRef(false);
  
  // Use useRef para evitar recreações dos use cases
  const useCasesRef = useRef({
    getAllEstablishmentsUseCase: container.getAllEstablishmentsUseCase(),
    createEstablishmentUseCase: container.createEstablishmentUseCase(),
    updateEstablishmentUseCase: container.updateEstablishmentUseCase(),
    deleteEstablishmentUseCase: container.deleteEstablishmentUseCase()
  });

  // Limpar a flag quando o componente for desmontado
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const loadEstablishments = useCallback(async () => {
    if (!isMountedRef.current) return;
    
    // Evitar carregamento duplo
    if (hasInitialLoadRef.current && !loading) {
      console.log("Skipping repeated establishments load");
      return;
    }
    
    console.log("Loading establishments...");
    setLoading(true);
    setError(null);
    
    try {
      const establishmentDTOs = await useCasesRef.current.getAllEstablishmentsUseCase.execute();
      
      if (isMountedRef.current) {
        console.log("Establishments loaded:", establishmentDTOs.length);
        setEstablishments(establishmentAdapter.toUIModelList(establishmentDTOs));
        hasInitialLoadRef.current = true;
      }
    } catch (err) {
      console.error("Error loading establishments:", err);
      if (isMountedRef.current) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar estabelecimentos';
        setError(errorMessage);
        toast.error("Erro ao carregar estabelecimentos", {
          description: errorMessage
        });
      }
    } finally {
      if (isMountedRef.current) {
        setLoading(false);
      }
    }
  }, [loading]); // Adicionado loading como dependência para evitar chamadas redundantes

  // Load establishments on first render using useEffect
  useEffect(() => {
    if (!hasInitialLoadRef.current) {
      loadEstablishments();
    }
  }, [loadEstablishments]);

  const handleCreate = async (establishment: Partial<EstablishmentWithDetails>) => {
    if (!isMountedRef.current) return;
    
    setIsCreating(true);
    try {
      if (!establishment.name || !establishment.type) {
        throw new Error('Nome e tipo do estabelecimento são obrigatórios');
      }
      
      const result = await useCasesRef.current.createEstablishmentUseCase.execute({
        name: establishment.name,
        type: establishment.type,
        carrierId: establishment.carrier_id
      });

      if (result.success && result.establishment) {
        await loadEstablishments(); // Reload establishments to get updated list
        toast.success("Estabelecimento cadastrado com sucesso");
        return establishmentAdapter.toUIModel(result.establishment);
      } else {
        toast.error("Erro ao cadastrar estabelecimento", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error creating establishment:", error);
      toast.error("Erro ao cadastrar estabelecimento");
      throw error;
    } finally {
      if (isMountedRef.current) {
        setIsCreating(false);
      }
    }
  };

  const handleEdit = async (establishment: EstablishmentWithDetails) => {
    if (!isMountedRef.current) return;
    
    setIsUpdating(true);
    try {
      const dto = establishmentAdapter.toDomainDTO(establishment);
      
      const result = await useCasesRef.current.updateEstablishmentUseCase.execute({
        id: dto.id,
        name: dto.name,
        type: dto.type,
        carrierId: dto.carrierId
      });

      if (result.success) {
        await loadEstablishments(); // Reload establishments to get updated list
        toast.success("Estabelecimento atualizado com sucesso");
      } else {
        toast.error("Erro ao atualizar estabelecimento", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error updating establishment:", error);
      toast.error("Erro ao atualizar estabelecimento");
      throw error;
    } finally {
      if (isMountedRef.current) {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async (establishment: EstablishmentWithDetails) => {
    if (!isMountedRef.current) return;
    
    setIsDeleting(true);
    try {
      const result = await useCasesRef.current.deleteEstablishmentUseCase.execute(establishment.id);
      
      if (result.success) {
        await loadEstablishments(); // Reload establishments to get updated list
        toast.success("Estabelecimento excluído com sucesso");
      } else {
        toast.error("Erro ao excluir estabelecimento", {
          description: result.error?.message
        });
        throw result.error;
      }
    } catch (error) {
      console.error("Error deleting establishment:", error);
      toast.error("Erro ao excluir estabelecimento");
      throw error;
    } finally {
      if (isMountedRef.current) {
        setIsDeleting(false);
      }
    }
  };

  return {
    establishments,
    loading,
    error,
    loadEstablishments,
    handleCreate,
    handleEdit,
    handleDelete,
    isCreating,
    isUpdating,
    isDeleting
  };
}
