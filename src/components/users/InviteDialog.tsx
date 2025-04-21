
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { maskPhoneBR, formatPhoneForStorage } from "@/lib/format";

// Permit only admin or owner roles
type RoleValue = "admin" | "owner";

// If you want to allow inviting owners, add an easy switch below (commented here; only admin by spec)
const ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "owner", label: "Proprietário" }
] as const;

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite: (form: { name: string; email: string; phone?: string; role: RoleValue }) => Promise<void>;
}

export function InviteDialog({ open, onOpenChange, onInvite }: InviteDialogProps) {
  // If you'd like to allow switching roles, uncomment the UI change below and relevant handlers
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "admin" as RoleValue });
  const [submitting, setSubmitting] = useState(false);

  const handleInvite = async () => {
    setSubmitting(true);
    const phoneFormatted = formatPhoneForStorage(form.phone);
    await onInvite({
      name: form.name,
      email: form.email,
      phone: phoneFormatted || undefined,
      role: form.role
    });
    setForm({ name: "", email: "", phone: "", role: "admin" });
    setSubmitting(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhoneBR(e.target.value);
    setForm(f => ({ ...f, phone: maskedValue }));
  };

  // You can add a dropdown to pick "admin" or "owner" here (for now: fixed)
  const roleLabel = form.role === "admin" ? "Administrador" : "Proprietário";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Novo Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="E-mail" value={form.email} type="email" onChange={e => setForm(f => ({ ...f, email: e.target.value }))} />
          <Input
            placeholder="Telefone"
            value={form.phone}
            onChange={handlePhoneChange}
            maxLength={15}
          />
          {/* Perfil fixo */}
          <Input value={roleLabel} readOnly disabled className="bg-gray-100 cursor-not-allowed" />
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            onClick={handleInvite}
            disabled={submitting || !form.email || !form.name}
          >
            Convidar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
