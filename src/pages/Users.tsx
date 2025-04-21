
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { InviteDialog } from "@/components/users/InviteDialog";
import { EditDialog } from "@/components/users/EditDialog";
import { ConfirmActionDialog } from "@/components/users/ConfirmActionDialog";
import { UsersHeader } from "@/components/users/UsersHeader";
import { UsersSearch } from "@/components/users/UsersSearch";
import { UsersTable } from "@/components/users/UsersTable";
import { useUsers } from "@/hooks/useUsers";
import { UserRow } from "@/types/user";
import { useAuth } from "@/context/AuthContext";
import { useUserInvite } from "@/hooks/useUserInvite";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

export default function Users() {
  const { user: currentUser, roles: currentUserRoles } = useAuth();
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

  const filteredUsers = users.filter((user) =>
    user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    user.id.includes(searchTerm)
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

  const handleRetry = () => {
    loadUsers();
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <UsersHeader onInvite={() => setInviteOpen(true)} />
        </CardHeader>
        <CardContent>
          <UsersSearch searchTerm={searchTerm} onSearch={setSearchTerm} />
          
          {error ? (
            <div className="flex flex-col items-center justify-center p-8 border rounded-md text-center">
              <p className="text-destructive mb-4">Erro ao carregar dados dos usuários</p>
              <Button 
                variant="outline" 
                onClick={handleRetry}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          ) : (
            <UsersTable
              users={filteredUsers}
              loading={loading}
              onEdit={setEditUser}
              onDelete={(user) => setConfirmModal({ action: "delete", user })}
              onDeactivate={(user) => setConfirmModal({ action: "deactivate", user })}
              onResendInvite={(user) => setConfirmModal({ action: "invite", user })}
            />
          )}
        </CardContent>
      </Card>

      {/* Modais */}
      <InviteDialog 
        open={inviteOpen} 
        onOpenChange={setInviteOpen} 
        onInvite={handleInviteUser} 
        isLoading={isInviteLoading}
      />
      
      {editUser && (
        <EditDialog
          user={{
            id: editUser.id,
            name: editUser.name,
            phone: editUser.phone,
            role: editUser.role === "admin" || editUser.role === "owner" ? editUser.role : "admin",
          }}
          onClose={() => setEditUser(null)}
          onEdit={handleEdit}
        />
      )}
      
      {confirmModal && (
        <ConfirmActionDialog
          open={!!confirmModal}
          action={confirmModal.action}
          user={confirmModal.user}
          onCancel={() => setConfirmModal(null)}
          onConfirm={() => {
            if (!confirmModal) return;
            if (confirmModal.action === "delete") handleDelete(confirmModal.user);
            if (confirmModal.action === "deactivate") handleDeactivate(confirmModal.user);
            if (confirmModal.action === "invite") handleResendInviteUser(confirmModal.user);
          }}
        />
      )}
    </div>
  );
}
