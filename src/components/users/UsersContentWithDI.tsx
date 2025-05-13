
import { UsersError } from "./UsersError";
import { UsersSearch } from "./UsersSearch";
import { UsersTableWithDI } from "./UsersTableWithDI";
import { UserDTO } from "@/application/dto/UserDTO";

interface UsersContentWithDIProps {
  error: string | null;
  loading: boolean;
  users: UserDTO[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onRetry: () => void;
  onEdit: (user: any) => void;
  onDelete: (user: any) => void;
  onDeactivate: (user: any) => void;
  onResendInvite: (user: any) => void;
  onResetPassword: (user: any) => void;
}

export function UsersContentWithDI({
  error,
  loading,
  users,
  searchTerm,
  onSearch,
  onRetry,
  onEdit,
  onDelete,
  onDeactivate,
  onResendInvite,
  onResetPassword,
}: UsersContentWithDIProps) {
  return (
    <>
      <UsersSearch searchTerm={searchTerm} onSearch={onSearch} />
      
      {error ? (
        <UsersError onRetry={onRetry} />
      ) : (
        <UsersTableWithDI
          users={users}
          loading={loading}
          onEdit={onEdit}
          onDelete={onDelete}
          onDeactivate={onDeactivate}
          onResendInvite={onResendInvite}
          onResetPassword={onResetPassword}
        />
      )}
    </>
  );
}
