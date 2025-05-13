
import { useState } from "react";
import { useUserCases } from "@/presentation/hooks/useUserCases";
import { UserRow } from "@/types/user";

export function useUsers() {
  const {
    users,
    isLoading: loading,
    error,
    refresh: loadUsers,
    editUser: handleEditUser,
    deleteUser: handleDeleteUser,
    deactivateUser: handleDeactivateUser
  } = useUserCases();

  // Adapting the return type to match what UsersTable expects
  const handleEdit = async (user: UserRow) => {
    const result = await handleEditUser(user.id, {
      name: user.name,
      phone: user.phone || null,
      role: user.roles?.[0] as "admin" | "owner"
    });
    // Ignore the success return value to match the expected Promise<void>
    return;
  };
  
  const handleDelete = async (user: UserRow) => {
    await handleDeleteUser(user.id);
  };

  const handleDeactivate = async (user: UserRow) => {
    await handleDeactivateUser(user.id);
  };

  return {
    users,
    loading,
    error,
    loadUsers,
    handleEdit,
    handleDelete,
    handleDeactivate
  };
}
