
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersContent } from "@/components/users/UsersContent";
import { UsersModals } from "@/components/users/UsersModals";
import { useUsers } from "@/hooks/useUsers";
import { UserRow } from "@/types/user";
import { useAuth } from "@/context/AuthContext";
import { useUserInvite } from "@/hooks/useUserInvite";

export default function Users() {
  const { roles: currentUserRoles } = useAuth();
  const isAdmin = currentUserRoles.includes("admin") || currentUserRoles.includes("owner");
  
  const {
    users,
    loading,
    error,
    loadUsers,
    handleEdit,
    handleDelete,
    handleDeactivate
  } = useUsers();
  
  const { sendInvite, resendInvite, isLoading: isInviteLoading } = useUserInvite();
  
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
    const result = await sendInvite(form);
    if (result.success) {
      setInviteOpen(false);
      loadUsers();
    }
  };

  const handleResendInviteUser = async (user: UserRow) => {
    const result = await resendInvite(user);
    if (result.success) {
      setConfirmModal(null);
      loadUsers();
    }
  };

  const handleConfirmAction = () => {
    if (!confirmModal) return;
    if (confirmModal.action === "delete") handleDelete(confirmModal.user);
    if (confirmModal.action === "deactivate") handleDeactivate(confirmModal.user);
    if (confirmModal.action === "invite") handleResendInviteUser(confirmModal.user);
  };

  return (
    <div className="space-y-6 p-6 bg-soft-purple min-h-screen">
      <Card className="border-none shadow-lg bg-white">
        <CardHeader className="bg-primary/10 py-4">
          <UsersHeader onInvite={() => setInviteOpen(true)} />
        </CardHeader>
        <CardContent className="p-6">
          <UsersContent
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

      <UsersModals
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
