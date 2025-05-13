
import { useUserCases } from "@/presentation/hooks/useUserCases";
import { UserRow } from "@/types/user";
import { userAdapter } from "@/adapters/users/userAdapter";
import { UserDTO } from "@/application/dto/UserDTO";

export function useUsers() {
  const {
    users: usersDTO,
    loading,
    error,
    loadUsers,
    handleDelete: handleDeleteDTO,
    handleDeactivate: handleDeactivateDTO,
    handleResetPassword
  } = useUserCases();

  // Convert DTOs to UI models
  const users = usersDTO.map(userDTO => userAdapter.toUIModel(userDTO));

  // Adapting the return type to match what UsersTable expects
  const handleEdit = async (userId: string, updates: { name: string; phone: string | null; role: "admin" | "owner" }) => {
    // Since we don't have an editUser in useUserCases, we would need to implement it
    // For now, this is a placeholder that returns void as expected
    console.log("Edit user:", userId, updates);
    return;
  };
  
  const handleDelete = async (user: UserRow) => {
    // Convert UI model to DTO before passing to useUserCases
    const userDTO = userAdapter.fromUIModel(user);
    return await handleDeleteDTO(userDTO);
  };

  const handleDeactivate = async (user: UserRow) => {
    // Convert UI model to DTO before passing to useUserCases
    const userDTO = userAdapter.fromUIModel(user);
    return await handleDeactivateDTO(userDTO);
  };

  const resetPassword = async (userId: string, password: string) => {
    // No need for type conversion here since we're just passing the ID and password
    return await handleResetPassword(userId, password);
  };

  return {
    users,
    loading,
    error,
    loadUsers,
    refresh: loadUsers,
    handleEdit,
    editUser: handleEdit,
    handleDelete,
    deleteUser: handleDelete,
    handleDeactivate,
    deactivateUser: handleDeactivate,
    resetPassword
  };
}
