
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CarriersHeader } from "@/components/carriers/CarriersHeader";
import { CarriersSearch } from "@/components/carriers/CarriersSearch";
import { CarriersTable } from "@/components/carriers/CarriersTable";
import { EditCarrierDialog } from "@/components/carriers/EditCarrierDialog";
import { ConfirmActionDialog } from "@/components/carriers/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { ManageCollectionPointsDialog } from "@/components/establishments/collection-points/ManageCollectionPointsDialog";
import { useCarrierCasesWithDI } from "@/presentation/hooks/useCarrierCasesWithDI";
import { carrierAdapter } from "@/adapters/carriers/carrierAdapter";
import type { Carrier } from "@/types/carrier";

export default function Carriers() {
  const {
    carriers: carrierDTOs,
    loading,
    error,
    loadCarriers,
    handleCreate: createCarrier,
    handleEdit: editCarrier,
    handleDelete: deleteCarrier,
    handleDeactivate: deactivateCarrier,
    isCreating
  } = useCarrierCasesWithDI();
  
  // Convert DTOs to UI models
  const carriers = carrierAdapter.toUIModelList(carrierDTOs);
  
  // Log para depuração
  console.log("Carrier DTOs:", carrierDTOs);
  console.log("Carriers UI models:", carriers);
  
  const [searchTerm, setSearchTerm] = useState("");
  const [editCarrierData, setEditCarrierData] = useState<Carrier | null>(null);
  const [confirmModal, setConfirmModal] = useState<null | { action: "delete" | "deactivate", carrier: Carrier }>(null);
  const [managePointsCarrier, setManagePointsCarrier] = useState<Carrier | null>(null);

  const filteredCarriers = carriers.filter((carrier) =>
    carrier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.city?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.manager?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.phone?.includes(searchTerm)
  );

  const handleAddCarrier = () => {
    setEditCarrierData({ id: '', name: '', city: '', manager: '', phone: '', email: '', is_active: true });
  };

  const handleCarrierSave = async (carrier: Carrier) => {
    // Convert UI model to DTO
    const carrierDTO = carrierAdapter.toDomainDTO(carrier);
    
    if (!carrier.id) {
      await createCarrier(carrierDTO);
    } else {
      await editCarrier(carrierDTO);
    }
    setEditCarrierData(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    
    // Convert UI model to DTO
    const carrierDTO = carrierAdapter.toDomainDTO(confirmModal.carrier);
    
    if (confirmModal.action === "delete") {
      await deleteCarrier(carrierDTO);
    } else if (confirmModal.action === "deactivate") {
      await deactivateCarrier(carrierDTO);
    }
    
    setConfirmModal(null);
  };

  return (
    <div className="space-y-6">
      <Card className="border-none shadow-md">
        <CardHeader>
          <CarriersHeader onAdd={handleAddCarrier} />
        </CardHeader>
        <CardContent>
          <CarriersSearch searchTerm={searchTerm} onSearch={setSearchTerm} />
          
          {error ? (
            <div className="flex flex-col items-center justify-center p-8 border rounded-md text-center">
              <p className="text-destructive mb-4">Erro ao carregar dados das transportadoras</p>
              <Button 
                variant="outline" 
                onClick={loadCarriers}
                className="flex items-center gap-2"
              >
                <RefreshCcw className="h-4 w-4" />
                Tentar novamente
              </Button>
            </div>
          ) : (
            <CarriersTable
              carriers={filteredCarriers}
              loading={loading}
              onEdit={setEditCarrierData}
              onDelete={(carrier) => setConfirmModal({ action: "delete", carrier })}
              onDeactivate={(carrier) => setConfirmModal({ action: "deactivate", carrier })}
              onManageCollectionPoints={setManagePointsCarrier}
            />
          )}
        </CardContent>
      </Card>

      {editCarrierData && (
        <EditCarrierDialog
          carrier={editCarrierData}
          onClose={() => setEditCarrierData(null)}
          onSave={handleCarrierSave}
          isSubmitting={isCreating}
        />
      )}
      
      {confirmModal && (
        <ConfirmActionDialog
          open={!!confirmModal}
          action={confirmModal.action}
          carrier={confirmModal.carrier}
          onCancel={() => setConfirmModal(null)}
          onConfirm={handleConfirmAction}
        />
      )}

      {managePointsCarrier && (
        <ManageCollectionPointsDialog
          open={!!managePointsCarrier}
          onOpenChange={() => setManagePointsCarrier(null)}
          carrierContext={{ carrierId: managePointsCarrier.id }}
        />
      )}
    </div>
  );
}
