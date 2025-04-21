
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EstablishmentsHeader } from "@/components/establishments/EstablishmentsHeader";
import { EstablishmentsSearch } from "@/components/establishments/EstablishmentsSearch";
import { EstablishmentsTable } from "@/components/establishments/EstablishmentsTable";
import { useEstablishments } from "@/hooks/useEstablishments";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import type { Establishment } from "@/types/establishment";

export default function Establishments() {
  const {
    establishments,
    loading,
    error,
    loadEstablishments,
    handleEdit,
    handleDelete
  } = useEstablishments();
  
  const [searchTerm, setSearchTerm] = useState("");

  const filteredEstablishments = establishments.filter((establishment) =>
    establishment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    establishment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    establishment.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <EstablishmentsHeader onAdd={() => {}} />
        </CardHeader>
        <CardContent>
          <EstablishmentsSearch searchTerm={searchTerm} onSearch={setSearchTerm} />
          
          {error ? (
            <div className="flex flex-col items-center justify-center p-8 border rounded-md text-center">
              <p className="text-destructive mb-4">Erro ao carregar dados dos estabelecimentos</p>
              <Button 
                variant="outline" 
                onClick={loadEstablishments}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          ) : (
            <EstablishmentsTable
              establishments={filteredEstablishments}
              loading={loading}
              onEdit={() => {}}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
