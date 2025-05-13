
import { useState } from "react";
import { useUserCases } from "@/presentation/hooks/useUserCases";
import { UserRow } from "@/types/user";
import { userAdapter } from "@/adapters/users/userAdapter";

export function useUsers() {
  const {
    users: usersDTO,
    loading,
    error,
    loadUsers,
    handleDelete: handleDeleteUser,
    handleDeactivate: handleDeactivateUser
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
    await handleDeleteUser(userAdapter.fromUIModel(user));
  };

  const handleDeactivate = async (user: UserRow) => {
    await handleDeactivateUser(userAdapter.fromUIModel(user));
  };

  return {
    users,
    loading,
    error,
    loadUsers: loadUsers,  // Alias for refresh
    refresh: loadUsers,
    handleEdit,
    editUser: handleEdit,  // Alias
    handleDelete,
    deleteUser: handleDelete,  // Alias
    handleDeactivate,
    deactivateUser: handleDeactivate  // Alias
  };
}
