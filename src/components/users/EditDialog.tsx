
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { maskPhoneBR, formatPhoneBR, formatPhoneForStorage } from "@/lib/format";

// Defining RoleValue to match the role types in Users.tsx
type RoleValue = "admin" | "user" | "owner" | "carrier" | "dropoff";

interface EditDialogProps {
  user: {
    id: string;
    name: string | null;
    phone: string | null;
    role: RoleValue;
  }
  onClose: () => void;
  onEdit: (userId: string, updates: { name: string; phone: string | null; role: RoleValue }) => Promise<void>;
}

export function EditDialog({ user, onClose, onEdit }: EditDialogProps) {
  const [form, setForm] = useState({
    name: user.name ?? "",
    phone: formatPhoneBR(user.phone) ?? "",
    role: "admin" as RoleValue, // Fixed to admin as requested
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    const phoneFormatted = formatPhoneForStorage(form.phone);
    await onEdit(user.id, {
      name: form.name,
      phone: phoneFormatted,
      role: "admin" // Always send admin role as requested
    });
    setSubmitting(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhoneBR(e.target.value);
    setForm(f => ({ ...f, phone: maskedValue }));
  };

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
          {/* Perfil fixo */}
          <Input value="Administrador" readOnly disabled className="bg-gray-100 cursor-not-allowed" />
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
