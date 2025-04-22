
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CarriersHeader } from "@/components/carriers/CarriersHeader";
import { CarriersSearch } from "@/components/carriers/CarriersSearch";
import { CarriersTable } from "@/components/carriers/CarriersTable";
import { useCarriers } from "@/hooks/useCarriers";
import { EditCarrierDialog } from "@/components/carriers/EditCarrierDialog";
import { ConfirmActionDialog } from "@/components/carriers/ConfirmActionDialog";
import { Button } from "@/components/ui/button";
import { RefreshCcw } from "lucide-react";
import { ManageCollectionPointsDialog } from "@/components/establishments/collection-points/ManageCollectionPointsDialog";
import type { Carrier } from "@/types/carrier";

export default function Carriers() {
  const {
    carriers,
    loading,
    error,
    loadCarriers,
    handleCreate,
    handleEdit,
    handleDelete,
    handleDeactivate,
    isCreating
  } = useCarriers();
  
  const [searchTerm, setSearchTerm] = useState("");
  const [editCarrier, setEditCarrier] = useState<Carrier | null>(null);
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
    setEditCarrier({ id: '', name: '', city: '', state: '', manager: '', phone: '', email: '', is_active: true });
  };

  const handleCarrierSave = async (carrier: Carrier) => {
    if (!carrier.id) {
      await handleCreate(carrier);
    } else {
      await handleEdit(carrier);
    }
    setEditCarrier(null);
  };

  const handleConfirmAction = async () => {
    if (!confirmModal) return;
    
    if (confirmModal.action === "delete") {
      await handleDelete(confirmModal.carrier);
    } else if (confirmModal.action === "deactivate") {
      await handleDeactivate(confirmModal.carrier);
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
              onEdit={setEditCarrier}
              onDelete={(carrier) => setConfirmModal({ action: "delete", carrier })}
              onDeactivate={(carrier) => setConfirmModal({ action: "deactivate", carrier })}
              onManageCollectionPoints={setManagePointsCarrier}
            />
          )}
        </CardContent>
      </Card>

      {editCarrier && (
        <EditCarrierDialog
          carrier={editCarrier}
          onClose={() => setEditCarrier(null)}
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
