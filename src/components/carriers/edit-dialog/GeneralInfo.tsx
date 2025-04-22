
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import type { Carrier } from "@/types/carrier";

interface GeneralInfoProps {
  formData: Carrier;
  isSubmitting?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  setFormData: (value: React.SetStateAction<Carrier>) => void;
}

export function GeneralInfo({
  formData,
  isSubmitting = false,
  handleChange,
  setFormData,
}: GeneralInfoProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          placeholder="Nome da transportadora"
          value={formData.name || ''}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="flex items-center space-x-2">
        <Checkbox
          id="is_active"
          checked={formData.is_active || false}
          onCheckedChange={(checked) => {
            const isActive = checked === true;
            setFormData(prev => ({ ...prev, is_active: isActive }));
          }}
          disabled={isSubmitting}
        />
        <Label htmlFor="is_active">Transportadora ativa</Label>
      </div>
    </>
  );
}
