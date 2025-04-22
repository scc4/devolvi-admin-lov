
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { maskPhoneBR, formatPhoneForStorage } from "@/lib/format";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useDialogCleanup } from "@/hooks/useDialogCleanup";

// Permit only admin or owner roles
type RoleValue = "admin" | "owner";

const ROLES = [
  { value: "admin", label: "Administrador" },
  { value: "owner", label: "Proprietário" }
] as const;

interface InviteDialogProps {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  onInvite: (form: { name: string; email: string; phone?: string; role: RoleValue }) => Promise<void>;
  isLoading?: boolean;
}

export function InviteDialog({ open, onOpenChange, onInvite, isLoading = false }: InviteDialogProps) {
  const [form, setForm] = useState({ name: "", email: "", phone: "", role: "admin" as RoleValue });
  const [submitting, setSubmitting] = useState(false);

  // Use our custom cleanup hook
  useDialogCleanup({ open });

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

  const handleRoleChange = (value: string) => {
    setForm(f => ({ ...f, role: value as RoleValue }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Convidar Novo Usuário</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input 
            placeholder="Nome" 
            value={form.name} 
            onChange={e => setForm(f => ({ ...f, name: e.target.value }))} 
            disabled={submitting || isLoading}
          />
          <Input 
            placeholder="E-mail" 
            value={form.email} 
            type="email" 
            onChange={e => setForm(f => ({ ...f, email: e.target.value }))} 
            disabled={submitting || isLoading}
          />
          <Input
            placeholder="Telefone"
            value={form.phone}
            onChange={handlePhoneChange}
            maxLength={15}
            disabled={submitting || isLoading}
          />
          
          <Select 
            value={form.role} 
            onValueChange={handleRoleChange}
            disabled={submitting || isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o perfil" />
            </SelectTrigger>
            <SelectContent>
              {ROLES.map(role => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={submitting || isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleInvite}
            disabled={submitting || isLoading || !form.email || !form.name}
          >
            {(submitting || isLoading) ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Convidar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
