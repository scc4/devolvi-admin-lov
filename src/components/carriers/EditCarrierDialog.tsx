
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { maskPhoneBR, formatPhoneBR, formatPhoneForStorage } from "@/lib/format";
import { Loader2 } from "lucide-react";
import type { Carrier } from "@/types/carrier";

interface EditCarrierDialogProps {
  carrier: Carrier;
  onClose: () => void;
  onSave: (carrier: Carrier) => Promise<void>;
  isSubmitting?: boolean;
}

export function EditCarrierDialog({ carrier, onClose, onSave, isSubmitting = false }: EditCarrierDialogProps) {
  const [form, setForm] = useState({
    ...carrier,
    phone: formatPhoneBR(carrier.phone) ?? "",
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!form.name || !form.city || !form.manager) {
      return;
    }
    
    setSubmitting(true);
    const phoneFormatted = formatPhoneForStorage(form.phone);
    await onSave({
      ...form,
      phone: phoneFormatted,
    });
    setSubmitting(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhoneBR(e.target.value);
    setForm(f => ({ ...f, phone: maskedValue }));
  };

  const isNew = !carrier.id;
  const isDisabled = submitting || isSubmitting || !form.name || !form.city || !form.manager;

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{isNew ? 'Nova Transportadora' : 'Editar Transportadora'}</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input 
            placeholder="Nome" 
            value={form.name} 
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
          />
          <Input 
            placeholder="Cidade" 
            value={form.city} 
            onChange={e => setForm(f => ({ ...f, city: e.target.value }))}
          />
          <Input 
            placeholder="Gestor Responsável" 
            value={form.manager} 
            onChange={e => setForm(f => ({ ...f, manager: e.target.value }))}
          />
          <Input
            placeholder="Telefone"
            value={form.phone}
            onChange={handlePhoneChange}
            maxLength={15}
          />
          <Input 
            placeholder="E-mail" 
            type="email"
            value={form.email ?? ''} 
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))}
          />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose} disabled={submitting || isSubmitting}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            disabled={isDisabled}
          >
            {(submitting || isSubmitting) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            {isNew ? 'Criar' : 'Salvar Alterações'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
