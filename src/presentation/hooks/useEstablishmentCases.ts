
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
  
  // Use useRef para evitar recreações dos use cases
  const useCasesRef = useRef({
    getAllEstablishmentsUseCase: container.getAllEstablishmentsUseCase(),
    createEstablishmentUseCase: container.createEstablishmentUseCase(),
    updateEstablishmentUseCase: container.updateEstablishmentUseCase(),
    deleteEstablishmentUseCase: container.deleteEstablishmentUseCase()
  });

  // Flag para controlar se o componente está montado
  const isMounted = useRef(true);

  // Limpar a flag quando o componente for desmontado
  useEffect(() => {
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadEstablishments = useCallback(async () => {
    if (!isMounted.current) return;
    
    console.log("Loading establishments...");
    setLoading(true);
    setError(null);
    
    try {
      const establishmentDTOs = await useCasesRef.current.getAllEstablishmentsUseCase.execute();
      
      if (isMounted.current) {
        console.log("Establishments loaded:", establishmentDTOs.length);
        setEstablishments(establishmentAdapter.toUIModelList(establishmentDTOs));
      }
    } catch (err) {
      console.error("Error loading establishments:", err);
      if (isMounted.current) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar estabelecimentos';
        setError(errorMessage);
        toast.error("Erro ao carregar estabelecimentos", {
          description: errorMessage
        });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []); // Sem dependências para evitar loops

  // Load establishments on first render using useEffect
  useEffect(() => {
    loadEstablishments();
  }, [loadEstablishments]);

  const handleCreate = async (establishment: Partial<EstablishmentWithDetails>) => {
    if (!isMounted.current) return;
    
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
      if (isMounted.current) {
        setIsCreating(false);
      }
    }
  };

  const handleEdit = async (establishment: EstablishmentWithDetails) => {
    if (!isMounted.current) return;
    
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
      if (isMounted.current) {
        setIsUpdating(false);
      }
    }
  };

  const handleDelete = async (establishment: EstablishmentWithDetails) => {
    if (!isMounted.current) return;
    
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
      if (isMounted.current) {
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
