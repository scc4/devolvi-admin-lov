
import { Button } from "@/components/ui/button";
import { RefreshCcw, Printer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CollectionPointAssociationHeaderProps {
  onRefresh: () => void;
  onPrint: () => void;
  isLoading?: boolean;
  title?: string;
}

export function CollectionPointAssociationHeader({ 
  onRefresh, 
  onPrint,
  isLoading = false,
  title = "Gerenciar Associações"
}: CollectionPointAssociationHeaderProps) {
  const { isMobile } = useIsMobile();

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium">{title}</h2>
      <div className="flex gap-2">
        <Button
          variant="outline" 
          size="sm" 
          onClick={onRefresh}
          disabled={isLoading}
        >
          <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
          {!isMobile && <span className="ml-2">Atualizar</span>}
        </Button>
        <Button
          variant="outline" 
          size="sm" 
          onClick={onPrint}
        >
          <Printer className="h-4 w-4" />
          {!isMobile && <span className="ml-2">Imprimir</span>}
        </Button>
      </div>
    </div>
  );
}
