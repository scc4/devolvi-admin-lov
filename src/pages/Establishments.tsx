
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EstablishmentsHeader } from "@/components/establishments/EstablishmentsHeader";
import { EstablishmentsSearch } from "@/components/establishments/EstablishmentsSearch";
import { EstablishmentsTable } from "@/components/establishments/EstablishmentsTable";
import { EstablishmentFormDialog } from "@/components/establishments/EstablishmentFormDialog";
import { useEstablishments } from "@/hooks/useEstablishments";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import type { EstablishmentWithDetails } from "@/types/establishment";

export default function Establishments() {
  const {
    establishments,
    loading,
    error,
    loadEstablishments,
    handleEdit,
    handleDelete,
    handleCreate
  } = useEstablishments();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<EstablishmentWithDetails | undefined>(undefined);

  const filteredEstablishments = establishments.filter((establishment) =>
    establishment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    establishment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    establishment.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setSelectedEstablishment(undefined);
    setDialogOpen(true);
  };

  const handleOpenEdit = (establishment: EstablishmentWithDetails) => {
    setSelectedEstablishment(establishment);
    setDialogOpen(true);
  };

  const handleFormSubmit = async (data: Partial<EstablishmentWithDetails>) => {
    if (selectedEstablishment) {
      await handleEdit({
        ...selectedEstablishment,
        ...data
      });
    } else {
      await handleCreate(data);
    }
    setDialogOpen(false);
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <EstablishmentsHeader onAdd={handleOpenCreate} />
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
              onEdit={handleOpenEdit}
              onDelete={handleDelete}
            />
          )}
        </CardContent>
      </Card>

      <EstablishmentFormDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedEstablishment}
        isLoading={false}
      />
    </div>
  );
}
