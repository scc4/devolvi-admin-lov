
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { CarriersSearch } from "@/components/carriers/CarriersSearch";
import { CarriersHeader } from "@/components/carriers/CarriersHeader";
import { CarriersTable } from "@/components/carriers/CarriersTable";
import { EditCarrierDialog } from "@/components/carriers/EditCarrierDialog";
import { ConfirmActionDialog } from "@/components/carriers/ConfirmActionDialog";
import { useCarriers } from "@/hooks/useCarriers";
import { Carrier } from "@/types/carrier";
import { ManageCollectionPointsDialog } from "@/components/establishments/collection-points/ManageCollectionPointsDialog";
import { carrierAdapter } from "@/adapters/carriers/carrierAdapter";

export default function Carriers() {
  const [searchTerm, setSearchTerm] = useState("");
  const [editCarrier, setEditCarrier] = useState<Carrier | null>(null);
  const [confirmModal, setConfirmModal] = useState<null | { action: "delete"; carrier: Carrier }>(null);
  const [collectionPointsOpen, setCollectionPointsOpen] = useState(false);
  const [selectedCarrier, setSelectedCarrier] = useState<Carrier | null>(null);

  const {
    carriers,
    loading,
    error,
    refresh, // Using refresh instead of loadCarriers
    handleEdit,
    handleDelete
  } = useCarriers();

  const filteredCarriers = carriers.filter((carrier) =>
    carrier.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    carrier.email?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleConfirmAction = () => {
    if (!confirmModal) return;
    if (confirmModal.action === "delete") {
      // Convert UI model to DTO when passing to handleDelete
      const carrierDTO = carrierAdapter.toDomainDTO(confirmModal.carrier);
      handleDelete(carrierDTO);
    }
  };

  return (
    <div className="space-y-6 p-6 bg-soft-purple min-h-screen">
      <Card className="border-none shadow-lg bg-white">
        <CardHeader className="bg-primary/10 py-4">
          <CarriersHeader onAdd={() => {}} />
        </CardHeader>
        <CardContent className="p-6">
          <CarriersSearch searchTerm={searchTerm} onSearch={setSearchTerm} />
          <CarriersTable
            error={error}
            loading={loading}
            carriers={filteredCarriers}
            onRetry={refresh} // Using refresh instead of loadCarriers
            onEdit={setEditCarrier}
            onDelete={(carrier) => setConfirmModal({ action: "delete", carrier })}
            onManageCollectionPoints={(carrier) => {
              setSelectedCarrier(carrier);
              setCollectionPointsOpen(true);
            }}
          />
        </CardContent>
      </Card>

      {editCarrier && (
        <EditCarrierDialog
          carrier={editCarrier}
          onClose={() => setEditCarrier(null)}
          onEdit={async (carrier) => {
            // Convert UI model to DTO when passing to handleEdit
            const carrierDTO = carrierAdapter.toDomainDTO(carrier);
            await handleEdit(carrierDTO);
          }}
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

      {selectedCarrier && (
        <ManageCollectionPointsDialog
          open={collectionPointsOpen}
          carrier={selectedCarrier}
          onOpenChange={setCollectionPointsOpen}
        />
      )}
    </div>
  );
}
