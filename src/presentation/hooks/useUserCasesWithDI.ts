
import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserDTO } from '../../application/dto/UserDTO';
import { container } from '../../infrastructure/di/container';

/**
 * Hook to expose user-related use cases to the presentation layer using DI
 */
export function useUserCasesWithDI() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  
  // Get use cases from container
  const getAllUsersUseCase = container.getAllUsersUseCase();
  const deleteUserUseCase = container.deleteUserUseCase();
  const deactivateUserUseCase = container.deactivateUserUseCase();
  const resetPasswordUseCase = container.resetPasswordUseCase();

  const loadUsers = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const userDTOs = await getAllUsersUseCase.execute();
      setUsers(userDTOs);
    } catch (err) {
      console.error("Error loading users:", err);
      const errorMessage = err instanceof Error ? err.message : 'Erro desconhecido ao carregar usuários';
      setError(errorMessage);
      toast({ 
        title: "Erro ao carregar usuários", 
        description: errorMessage, 
        variant: "destructive" 
      });
    } finally {
      setLoading(false);
    }
  }, [getAllUsersUseCase, toast]);

  const handleDelete = async (user: UserDTO): Promise<{ success: boolean }> => {
    try {
      const result = await deleteUserUseCase.execute(user.id);
      if (result.success) {
        toast({
          title: "Usuário excluído",
          description: "O usuário foi excluído com sucesso."
        });
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
      const result = await deactivateUserUseCase.execute(user.id);
      if (result.success) {
        toast({
          title: "Usuário inativado",
          description: "O usuário foi inativado com sucesso."
        });
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
    return await resetPasswordUseCase.execute(userId, password);
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
