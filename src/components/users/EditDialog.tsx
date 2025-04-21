
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { maskPhoneBR, formatPhoneBR, formatPhoneForStorage } from "@/lib/format";

// Allow only Admin or Owner
type RoleValue = "admin" | "owner";

interface EditDialogProps {
  user: {
    id: string;
    name: string | null;
    phone: string | null;
    role: RoleValue; // Only accept admin or owner here
  }
  onClose: () => void;
  onEdit: (userId: string, updates: { name: string; phone: string | null; role: RoleValue }) => Promise<void>;
}

export function EditDialog({ user, onClose, onEdit }: EditDialogProps) {
  // Start with user's role if admin/owner, otherwise default to admin
  const [form, setForm] = useState({
    name: user.name ?? "",
    phone: formatPhoneBR(user.phone) ?? "",
    role: user.role === "admin" || user.role === "owner" ? user.role : "admin" as RoleValue,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const phoneFormatted = formatPhoneForStorage(form.phone);
    await onEdit(user.id, {
      name: form.name,
      phone: phoneFormatted,
      role: form.role // Use the fixed role
    });
    setSubmitting(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhoneBR(e.target.value);
    setForm(f => ({ ...f, phone: maskedValue }));
  };

  // Map value to human readable label (for pt-BR)
  const roleLabel = form.role === "admin" ? "Administrador" : "Proprietário";

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input
            placeholder="Telefone"
            value={form.phone}
            onChange={handlePhoneChange}
            maxLength={15}
          />
          {/* Perfil fixo: mostrar label conforme role */}
          <Input value={roleLabel} readOnly disabled className="bg-gray-100 cursor-not-allowed" />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>Cancelar</Button>
          <Button
            onClick={handleSubmit}
            disabled={submitting || !form.name}
          >
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
