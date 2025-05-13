
import { Button } from "@/components/ui/button";
import { RefreshCcw, Printer } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface CollectionPointAssociationHeaderProps {
  onRefresh?: () => void;
  onPrint?: () => void;
  isLoading?: boolean;
  title?: string;
  carrierId?: string; // Added carrierId prop
  carrierName?: string;
  carrierCity?: string;
  establishmentId?: string; // Added establishmentId prop
}

export function CollectionPointAssociationHeader({ 
  onRefresh, 
  onPrint,
  isLoading = false,
  title = "Gerenciar Associações",
  carrierId, // Now correctly typed
  carrierName,
  carrierCity,
  establishmentId // Now correctly typed
}: CollectionPointAssociationHeaderProps) {
  const { isMobile } = useIsMobile();

  // Format title with carrier info if provided
  const headerTitle = carrierName 
    ? `${title} - ${carrierName}${carrierCity ? ` (${carrierCity})` : ''}`
    : title;

  return (
    <div className="flex items-center justify-between">
      <h2 className="text-lg font-medium">{headerTitle}</h2>
      <div className="flex gap-2">
        {onRefresh && (
          <Button
            variant="outline" 
            size="sm" 
            onClick={onRefresh}
            disabled={isLoading}
          >
            <RefreshCcw className={`h-4 w-4 ${isLoading ? "animate-spin" : ""}`} />
            {!isMobile && <span className="ml-2">Atualizar</span>}
          </Button>
        )}
        {onPrint && (
          <Button
            variant="outline" 
            size="sm" 
            onClick={onPrint}
          >
            <Printer className="h-4 w-4" />
            {!isMobile && <span className="ml-2">Imprimir</span>}
          </Button>
        )}
      </div>
    </div>
  );
}
