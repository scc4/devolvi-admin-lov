
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { EstablishmentsHeader } from "@/components/establishments/EstablishmentsHeader";
import { EstablishmentsSearch } from "@/components/establishments/EstablishmentsSearch";
import { EstablishmentsTable } from "@/components/establishments/EstablishmentsTable";
import { EstablishmentFormDialog } from "@/components/establishments/EstablishmentFormDialog";
import { ManageCollectionPointsDialog } from "@/components/establishments/collection-points/ManageCollectionPointsDialog";
import { useEstablishmentCasesWithDI } from "@/presentation/hooks/useEstablishmentCasesWithDI";
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
    handleCreate,
    isCreating,
    isUpdating
  } = useEstablishmentCasesWithDI();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [collectionPointsDialogOpen, setCollectionPointsDialogOpen] = useState(false);
  const [selectedEstablishment, setSelectedEstablishment] = useState<EstablishmentWithDetails | undefined>(undefined);

  const filteredEstablishments = establishments.filter((establishment) =>
    establishment.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    establishment.id?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    establishment.type?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenCreate = () => {
    setSelectedEstablishment(undefined);
    setEditDialogOpen(true);
  };

  const handleOpenEdit = (establishment: EstablishmentWithDetails) => {
    setSelectedEstablishment(establishment);
    setEditDialogOpen(true);
  };

  const handleOpenCollectionPoints = (establishment: EstablishmentWithDetails) => {
    setSelectedEstablishment(establishment);
    setCollectionPointsDialogOpen(true);
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
    setEditDialogOpen(false);
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
              onManageCollectionPoints={handleOpenCollectionPoints}
            />
          )}
        </CardContent>
      </Card>

      <EstablishmentFormDialog
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        onSubmit={handleFormSubmit}
        initialData={selectedEstablishment}
        isLoading={isCreating || isUpdating}
      />

      {selectedEstablishment && (
        <ManageCollectionPointsDialog
          open={collectionPointsDialogOpen}
          onOpenChange={setCollectionPointsDialogOpen}
          establishmentId={selectedEstablishment.id}
          establishmentName={selectedEstablishment.name}
        />
      )}
    </div>
  );
}
