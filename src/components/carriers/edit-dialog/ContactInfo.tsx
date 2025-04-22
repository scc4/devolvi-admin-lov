
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { Carrier } from "@/types/carrier";

interface ContactInfoProps {
  formData: Carrier;
  isSubmitting?: boolean;
  handleChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  handlePhoneChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export function ContactInfo({
  formData,
  isSubmitting = false,
  handleChange,
  handlePhoneChange,
}: ContactInfoProps) {
  return (
    <>
      <div className="space-y-2">
        <Label htmlFor="manager">Gestor Responsável</Label>
        <Input
          id="manager"
          placeholder="Gestor responsável"
          value={formData.manager || ''}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Telefone</Label>
        <Input
          id="phone"
          placeholder="(00) 00000-0000"
          type="tel"
          inputMode="tel"
          value={formData.phone || ''}
          onChange={handlePhoneChange}
          disabled={isSubmitting}
          maxLength={15}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          placeholder="Email"
          value={formData.email || ''}
          onChange={handleChange}
          disabled={isSubmitting}
        />
      </div>
    </>
  );
}
