
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

// Types passed via props
type RoleValue = "owner" | "admin" | "carrier" | "dropoff" | "user";
const ROLES = [
  { value: "owner", label: "Proprietário" },
  { value: "admin", label: "Administrador" },
  { value: "carrier", label: "Transportador" },
  { value: "dropoff", label: "Ponto de Entrega" },
  { value: "user", label: "Usuário" },
] as const;

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
    phone: user.phone ?? "",
    role: user.role,
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    setSubmitting(true);
    await onEdit(user.id, form);
    setSubmitting(false);
  };

  return (
    <Dialog open onOpenChange={onClose}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Editar Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input placeholder="Nome" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          <Input placeholder="Telefone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} />
          <select
            className="w-full p-2 border rounded-md bg-background"
            value={form.role}
            onChange={e => setForm(f => ({ ...f, role: e.target.value as RoleValue }))}
          >
            {ROLES.map(r => <option value={r.value} key={r.value}>{r.label}</option>)}
          </select>
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
