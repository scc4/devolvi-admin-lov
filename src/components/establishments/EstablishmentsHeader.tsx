
import { Building, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardTitle } from "@/components/ui/card";
import { useIsMobile } from "@/hooks/use-mobile";

interface EstablishmentsHeaderProps {
  onAdd: () => void;
}

export function EstablishmentsHeader({ onAdd }: EstablishmentsHeaderProps) {
  const { isMobile } = useIsMobile();
  
  return (
    <div className="flex flex-row items-center justify-between pb-2">
      <div className="flex items-center gap-2">
        <Building className="mr-1 h-5 w-5 text-primary" />
        <CardTitle className="text-xl font-bold">Gerenciar Estabelecimentos</CardTitle>
      </div>
      <Button 
        className="bg-primary hover:bg-primary/90" 
        onClick={onAdd}
        aria-label="Cadastrar Estabelecimento"
      >
        <Plus className="h-4 w-4" />
        {!isMobile && <span className="ml-2">Cadastrar Estabelecimento</span>}
      </Button>
    </div>
  );
}
