
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";

interface UsersErrorProps {
  onRetry: () => void;
}

export function UsersError({ onRetry }: UsersErrorProps) {
  return (
    <div className="flex flex-col items-center justify-center p-8 border rounded-md text-center bg-soft-danger">
      <p className="text-destructive mb-4">Erro ao carregar dados dos usuários</p>
      <Button 
        variant="outline" 
        onClick={onRetry}
        className="flex items-center gap-2 text-destructive hover:bg-destructive/10"
      >
        <RefreshCcw className="h-4 w-4" />
        Tentar novamente
      </Button>
    </div>
  );
}
