
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersContentWithDI } from "@/components/users/UsersContentWithDI";
import { UsersModalsWithDI } from "@/components/users/UsersModalsWithDI";
import { UserRow } from "@/types/user";
import { useAuth } from "@/context/AuthContext";
import { useUserCasesWithDI } from "@/presentation/hooks/useUserCasesWithDI";

export default function UsersDDD() {
  const { roles: currentUserRoles } = useAuth();
  const isAdmin = currentUserRoles.includes("admin") || currentUserRoles.includes("owner");
  
  const {
    users,
    loading,
    error,
    loadUsers,
    handleDelete,
    handleDeactivate,
    handleResetPassword
  } = useUserCasesWithDI();
  
  // We'll need to implement these functions properly with our DI approach
  const [isInviteLoading, setIsInviteLoading] = useState(false);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [inviteOpen, setInviteOpen] = useState(false);
  const [editUser, setEditUser] = useState<UserRow | null>(null);
  const [confirmModal, setConfirmModal] = useState<null | { action: "delete" | "deactivate" | "invite", user: UserRow }>(null);
  const [resetPasswordUser, setResetPasswordUser] = useState<UserRow | null>(null);

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleInviteUser = async (form: { name: string; email: string; phone?: string; role: "admin" | "owner" }) => {
    setIsInviteLoading(true);
    try {
      // This would be handled by a useCase
      setInviteOpen(false);
      loadUsers();
      return { success: true };
    } catch (error) {
      return { success: false, error };
    } finally {
      setIsInviteLoading(false);
    }
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    
    if (confirmModal.action === "delete") {
      const result = await handleDelete(confirmModal.user);
      if (result.success) {
        setConfirmModal(null);
        loadUsers();
      }
    }
    
    if (confirmModal.action === "deactivate") {
      const result = await handleDeactivate(confirmModal.user);
      if (result.success) {
        setConfirmModal(null);
        loadUsers();
      }
    }
    
    if (confirmModal.action === "invite") {
      // Would be handled by a useCase
      setConfirmModal(null);
    }
  };

  const handleEdit = async (userId: string, updates: { name: string; phone: string | null; role: "admin" | "owner" }) => {
    // This would be handled by a useCase
    setEditUser(null);
    loadUsers();
  };

  return (
    <div className="space-y-6 p-6 bg-soft-purple min-h-screen">
      <Card className="border-none shadow-lg bg-white">
        <CardHeader className="bg-primary/10 py-4">
          <UsersHeader onInvite={() => setInviteOpen(true)} />
        </CardHeader>
        <CardContent className="p-6">
          <UsersContentWithDI
            error={error}
            loading={loading}
            users={filteredUsers}
            searchTerm={searchTerm}
            onSearch={setSearchTerm}
            onRetry={loadUsers}
            onEdit={setEditUser}
            onDelete={(user) => setConfirmModal({ action: "delete", user })}
            onDeactivate={(user) => setConfirmModal({ action: "deactivate", user })}
            onResendInvite={(user) => setConfirmModal({ action: "invite", user })}
            onResetPassword={setResetPasswordUser}
          />
        </CardContent>
      </Card>

      <UsersModalsWithDI
        inviteOpen={inviteOpen}
        editUser={editUser}
        confirmModal={confirmModal}
        resetPasswordUser={resetPasswordUser}
        isInviteLoading={isInviteLoading}
        onInviteOpenChange={setInviteOpen}
        onEditClose={() => setEditUser(null)}
        onConfirmCancel={() => setConfirmModal(null)}
        onResetPasswordChange={(open) => !open && setResetPasswordUser(null)}
        onInvite={handleInviteUser}
        onEdit={handleEdit}
        onConfirm={handleConfirmAction}
      />
    </div>
  );
}
