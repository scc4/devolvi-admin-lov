
import { Button } from "@/components/ui/button";
import { RefreshCcw, Printer } from "lucide-react";

interface CollectionPointAssociationHeaderProps {
  onRefresh: () => void;
  onPrint: () => void;
}

export function CollectionPointAssociationHeader({
  onRefresh,
  onPrint
}: CollectionPointAssociationHeaderProps) {
  return (
    <div className="flex gap-2">
      <Button variant="outline" size="sm" onClick={onRefresh}>
        <RefreshCcw className="h-4 w-4 mr-2" />
        Atualizar
      </Button>
      <Button 
        variant="outline" 
        size="sm" 
        onClick={onPrint}
      >
        <Printer className="h-4 w-4 mr-2" />
        Imprimir
      </Button>
    </div>
  );
}

