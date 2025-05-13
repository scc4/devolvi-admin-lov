
import { useState, useCallback, useEffect, useRef } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserDTO } from '../../application/dto/UserDTO';
import { container } from '../../infrastructure/di/container';

/**
 * Hook to expose user-related use cases to the presentation layer using DI
 */
export function useUserCases() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Use useRef to prevent recreation of use cases
  const useCasesRef = useRef({
    getAllUsersUseCase: container.getAllUsersUseCase(),
    deleteUserUseCase: container.deleteUserUseCase(),
    deactivateUserUseCase: container.deactivateUserUseCase(),
    resetPasswordUseCase: container.resetPasswordUseCase()
  });
  
  // Flag para controlar se o componente está montado
  const isMounted = useRef(true);
  
  // Flag para controlar se os dados já foram carregados
  const hasLoadedRef = useRef(false);

  // Limpar a flag quando o componente for desmontado
  useEffect(() => {
    // Reset hasLoaded quando o componente é montado
    hasLoadedRef.current = false;
    
    return () => {
      isMounted.current = false;
    };
  }, []);

  const loadUsers = useCallback(async (forceReload = false) => {
    if (!isMounted.current) return;
    
    // Evitar múltiplas chamadas desnecessárias
    if (hasLoadedRef.current && !forceReload) {
      console.log("Skipping user load, already loaded");
      return;
    }
    
    console.log("Loading users...");
    setLoading(true);
    setError(null);
    
    try {
      console.log("Fetching users with DI approach");
      const userDTOs = await useCasesRef.current.getAllUsersUseCase.execute();
      console.log("Users fetched:", userDTOs.length);
      
      if (isMounted.current) {
        // Armazena diretamente os DTOs sem casting
        setUsers(userDTOs);
        hasLoadedRef.current = true;
      }
    } catch (err) {
      console.error("Error loading users:", err);
      
      if (isMounted.current) {
        const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar usuários';
        setError(errorMessage);
        toast({ 
          title: "Erro ao carregar usuários", 
          description: errorMessage, 
          variant: "destructive" 
        });
      }
    } finally {
      if (isMounted.current) {
        setLoading(false);
      }
    }
  }, []); // Sem dependências para evitar loops

  // Load users on mount
  useEffect(() => {
    loadUsers();
  }, [loadUsers]);

  const handleDelete = async (user: UserDTO): Promise<{ success: boolean }> => {
    try {
      const result = await useCasesRef.current.deleteUserUseCase.execute(user.id);
      if (result.success) {
        toast({
          title: "Usuário excluído",
          description: "O usuário foi excluído com sucesso."
        });
        await loadUsers(true); // Forçar recarregamento após exclusão
        return { success: true };
      } else {
        toast({
          title: "Erro ao excluir usuário",
          description: result.error?.message || "Ocorreu um erro inesperado.",
          variant: "destructive"
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Error deleting user:", error);
      toast({
        title: "Erro ao excluir usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const handleDeactivate = async (user: UserDTO): Promise<{ success: boolean }> => {
    try {
      const result = await useCasesRef.current.deactivateUserUseCase.execute(user.id);
      if (result.success) {
        toast({
          title: "Usuário inativado",
          description: "O usuário foi inativado com sucesso."
        });
        await loadUsers(true); // Forçar recarregamento após inativação
        return { success: true };
      } else {
        toast({
          title: "Erro ao inativar usuário",
          description: result.error?.message || "Ocorreu um erro inesperado.",
          variant: "destructive"
        });
        return { success: false };
      }
    } catch (error) {
      console.error("Error deactivating user:", error);
      toast({
        title: "Erro ao inativar usuário",
        description: error instanceof Error ? error.message : "Ocorreu um erro inesperado.",
        variant: "destructive"
      });
      return { success: false };
    }
  };

  const handleResetPassword = async (userId: string, password: string): Promise<{ success: boolean; error?: Error }> => {
    return await useCasesRef.current.resetPasswordUseCase.execute(userId, password);
  };

  return {
    users,
    loading,
    error,
    loadUsers,
    handleDelete,
    handleDeactivate,
    handleResetPassword
  };
}
