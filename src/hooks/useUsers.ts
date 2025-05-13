
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

  // Edit user (name, phone, role)
  const editUser = async (userId: string, updates: { name: string; phone: string | null; role: "admin" | "owner" }) => {
    // Since we don't have an editUser in useUserCases, this is a placeholder
    console.log("Edit user:", userId, updates);
    return;
  };
  
  // Delete user - converts UI model to DTO for the use case
  const deleteUser = async (user: UserRow) => {
    const userDTO = userAdapter.fromUIModel(user);
    return await handleDeleteDTO(userDTO);
  };

  // Deactivate user - converts UI model to DTO for the use case
  const deactivateUser = async (user: UserRow) => {
    const userDTO = userAdapter.fromUIModel(user);
    return await handleDeactivateDTO(userDTO);
  };

  // Reset user password
  const resetPassword = async (userId: string, password: string) => {
    return await handleResetPassword(userId, password);
  };

  return {
    users,
    loading,
    error,
    loadUsers,
    refresh: loadUsers,
    editUser,
    deleteUser,
    deactivateUser,
    resetPassword
  };
}
