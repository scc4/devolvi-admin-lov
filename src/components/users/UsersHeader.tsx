
import { UserPlus, UsersIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";

interface UsersHeaderProps {
  onInvite: () => void;
}

export function UsersHeader({ onInvite }: UsersHeaderProps) {
  return (
    <div className="flex flex-row items-center justify-between pb-2">
      <div className="flex items-center gap-2">
        <UsersIcon className="mr-1 h-5 w-5 text-primary" />
        <CardTitle className="text-xl font-bold">Gerenciar Equipes</CardTitle>
      </div>
      <Button 
        className="bg-primary hover:bg-primary/90" 
        onClick={onInvite}
      >
        <UserPlus className="mr-2 h-4 w-4" /> Convidar Usuários
      </Button>
    </div>
  );
}
