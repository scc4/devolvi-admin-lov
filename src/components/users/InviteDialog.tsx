
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { maskPhoneBR } from "@/lib/format";

// Types passed as props
type RoleValue = "owner" | "admin" | "carrier" | "dropoff" | "user";
const ROLES = [
  { value: "owner", label: "Proprietário" },
  { value: "admin", label: "Administrador" },
  { value: "carrier", label: "Transportador" },
  { value: "dropoff", label: "Ponto de Entrega" },
  { value: "user", label: "Usuário" },
] as const;

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite: (form: { name: string; email: string; phone?: string; role: RoleValue }) => Promise<void>;
}

export function InviteDialog({ open, onOpenChange, onInvite }: InviteDialogProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "user" as RoleValue });
  const [submitting, setSubmitting] = useState(false);

  const handleInvite = async () => {
    setSubmitting(true);
    
    // Format phone for database with international code
    const phoneDigits = form.phone ? form.phone.replace(/\D/g, '') : "";
    const phoneFormatted = phoneDigits ? `+55${phoneDigits}` : undefined;
    
    await onInvite({
      name: form.name,
      email: form.email,
      phone: phoneFormatted,
      role: form.role
    });
    setForm({ name: "", email: "", phone: "", role: "user" });
    setSubmitting(false);
  };

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhoneBR(e.target.value);
    setForm(f => ({ ...f, phone: maskedValue }));
  };

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
          <select
            className="w-full p-2 border rounded-md bg-background"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value as RoleValue }))}
          >
            {ROLES.map(r => <option value={r.value} key={r.value}>{r.label}</option>)}
          </select>
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
