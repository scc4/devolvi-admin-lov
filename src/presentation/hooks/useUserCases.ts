import { useState, useCallback } from 'react';
import { useToast } from "@/hooks/use-toast";
import { UserDTO } from '../../application/dto/UserDTO';
import { GetAllUsersUseCase } from '../../application/useCases/user/GetAllUsersUseCase';
import { DeleteUserUseCase } from '../../application/useCases/user/DeleteUserUseCase';
import { DeactivateUserUseCase } from '../../application/useCases/user/DeactivateUserUseCase';
import { ResetPasswordUseCase } from '../../application/useCases/user/ResetPasswordUseCase';
import { SupabaseUserRepository } from '../../infrastructure/repositories/SupabaseUserRepository';

/**
 * Hook to expose user-related use cases to the presentation layer
 */
export function useUserCases() {
  const [users, setUsers] = useState<UserDTO[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  // Create repository instance
  const userRepository = new SupabaseUserRepository();
  
  // Create use case instances
  const getAllUsersUseCase = new GetAllUsersUseCase(userRepository);
  const deleteUserUseCase = new DeleteUserUseCase(userRepository);
  const deactivateUserUseCase = new DeactivateUserUseCase(userRepository);
  const resetPasswordUseCase = new ResetPasswordUseCase(userRepository);

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

  // Additional methods would be implemented here for other use cases

  return {
    users,
    loading,
    error,
    loadUsers,
    handleDelete,
    handleDeactivate,
    // Other methods would be exposed here
  };
}
