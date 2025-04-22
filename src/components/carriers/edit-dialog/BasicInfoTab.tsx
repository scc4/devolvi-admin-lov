
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import type { Carrier } from "@/types/carrier";
import { useCarrierForm } from "./useCarrierForm";
import { LocationInfo } from "./LocationInfo";
import { ContactInfo } from "./ContactInfo";
import { GeneralInfo } from "./GeneralInfo";

interface BasicInfoTabProps {
  carrier: Carrier;
  onSave: (carrier: Carrier) => Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
}

export function BasicInfoTab({ carrier, onSave, onClose, isSubmitting = false }: BasicInfoTabProps) {
  const { 
    formData, 
    states, 
    availableCities,
    isLoadingCities,
    handlePhoneChange,
    handleChange,
    handleSubmit,
    setFormData
  } = useCarrierForm(carrier, onSave);

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <GeneralInfo
        formData={formData}
        isSubmitting={isSubmitting}
        handleChange={handleChange}
        setFormData={setFormData}
      />

      <LocationInfo
        formData={formData}
        states={states}
        availableCities={availableCities}
        isLoadingCities={isLoadingCities}
        isSubmitting={isSubmitting}
        setFormData={setFormData}
      />

      <ContactInfo
        formData={formData}
        isSubmitting={isSubmitting}
        handleChange={handleChange}
        handlePhoneChange={handlePhoneChange}
      />
      
      <DialogFooter>
        <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
          Cancelar
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Salvando...
            </>
          ) : (
            'Salvar'
          )}
        </Button>
      </DialogFooter>
    </form>
  );
}
