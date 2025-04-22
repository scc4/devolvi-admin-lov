
import { Truck, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface CarriersHeaderProps {
  onAdd: () => void;
}

export function CarriersHeader({ onAdd }: CarriersHeaderProps) {
  const { isMobile } = useIsMobile();
  
  return (
    <div className="flex flex-row items-center justify-between pb-2">
      <div className="flex items-center gap-2">
        <Truck className="mr-1 h-5 w-5 text-primary" />
        <CardTitle className="text-xl font-bold">Gerenciar Transportadoras</CardTitle>
      </div>
      <Button 
        className="bg-primary hover:bg-primary/90" 
        onClick={onAdd}
        aria-label="Cadastrar Transportadora"
      >
        <Plus className="h-4 w-4" />
        {!isMobile && <span className="ml-2">Cadastrar Transportadora</span>}
      </Button>
    </div>
  );
}
