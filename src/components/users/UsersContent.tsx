
import { UsersError } from "./UsersError";
import { UsersSearch } from "./UsersSearch";
import { UsersTable } from "./UsersTable";
import { UserRow } from "@/types/user";

interface UsersContentProps {
  error: string | null;
  loading: boolean;
  users: UserRow[];
  searchTerm: string;
  onSearch: (term: string) => void;
  onRetry: () => void;
  onEdit: (user: UserRow) => void;
  onDelete: (user: UserRow) => void;
  onDeactivate: (user: UserRow) => void;
  onResendInvite: (user: UserRow) => void;
  onResetPassword: (user: UserRow) => void;
}

export function UsersContent({
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
}: UsersContentProps) {
  return (
    <>
      <UsersSearch searchTerm={searchTerm} onSearch={onSearch} />
      
      {error ? (
        <UsersError onRetry={onRetry} />
      ) : (
        <UsersTable
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
