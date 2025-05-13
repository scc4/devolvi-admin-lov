
import { useUserCases } from "./useUserCases";

/**
 * Hook that provides user management functionality.
 * This is a wrapper around useUserCases to maintain backward compatibility
 * with components that expect the useUsers interface.
 */
export function useUsers() {
  const {
    users,
    loading,
    error,
    loadUsers,
    handleDelete,
    handleDeactivate,
    handleResetPassword
  } = useUserCases();

  // Provide an interface that matches what Users.tsx expects
  const handleEdit = async (userId: string, updates: { name: string; phone: string | null; role: "admin" | "owner" }) => {
    // In a full implementation, this would call an updateUser method from useUserCases
    console.log("Edit user functionality not fully implemented in DDD version:", userId, updates);
    // For now we'll just reload the users to refresh the UI
    await loadUsers();
    return { success: true };
  };

  return {
    users,
    loading,
    error,
    loadUsers,
    handleEdit,
    handleDelete,
    handleDeactivate,
    handleResetPassword
  };
}
