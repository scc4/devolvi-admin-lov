
import { InviteDialog } from "./InviteDialog";
import { EditDialog } from "./EditDialog";
import { ConfirmActionDialog } from "./ConfirmActionDialog";
import { ResetPasswordDialog } from "./ResetPasswordDialog";
import { UserRow } from "@/types/user";

interface UsersModalsProps {
  inviteOpen: boolean;
  editUser: UserRow | null;
  confirmModal: null | { action: "delete" | "deactivate" | "invite"; user: UserRow };
  resetPasswordUser: UserRow | null;
  isInviteLoading: boolean;
  onInviteOpenChange: (open: boolean) => void;
  onEditClose: () => void;
  onConfirmCancel: () => void;
  onResetPasswordChange: (open: boolean) => void;
  onInvite: (form: { name: string; email: string; phone?: string; role: "admin" | "owner" }) => Promise<void>;
  onEdit: (userId: string, updates: { name: string; phone: string | null; role: "admin" | "owner" }) => Promise<void>;
  onConfirm: () => void;
}

export function UsersModals({
  inviteOpen,
  editUser,
  confirmModal,
  resetPasswordUser,
  isInviteLoading,
  onInviteOpenChange,
  onEditClose,
  onConfirmCancel,
  onResetPasswordChange,
  onInvite,
  onEdit,
  onConfirm,
}: UsersModalsProps) {
  return (
    <>
      <InviteDialog 
        open={inviteOpen} 
        onOpenChange={onInviteOpenChange} 
        onInvite={onInvite} 
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
          onClose={onEditClose}
          onEdit={onEdit}
        />
      )}
      
      {confirmModal && (
        <ConfirmActionDialog
          open={!!confirmModal}
          action={confirmModal.action}
          user={confirmModal.user}
          onCancel={onConfirmCancel}
          onConfirm={onConfirm}
        />
      )}

      <ResetPasswordDialog
        user={resetPasswordUser}
        open={!!resetPasswordUser}
        onOpenChange={onResetPasswordChange}
      />
    </>
  );
}
