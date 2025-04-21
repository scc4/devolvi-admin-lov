
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import type { EstablishmentWithDetails } from "@/types/establishment";

interface EstablishmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (establishment: Partial<EstablishmentWithDetails>) => Promise<void>;
  isLoading?: boolean;
}

export function EstablishmentFormDialog({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false
}: EstablishmentFormDialogProps) {
  const [form, setForm] = useState<{
    name: string;
    type: 'public' | 'private';
  }>({
    name: "",
    type: "public"
  });

  const handleSubmit = async () => {
    await onSubmit(form);
    setForm({ name: "", type: "public" });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Cadastrar Estabelecimento</DialogTitle>
        </DialogHeader>
        <div className="space-y-3 py-2">
          <Input
            placeholder="Nome do Estabelecimento"
            value={form.name}
            onChange={(e) => setForm(f => ({ ...f, name: e.target.value }))}
            disabled={isLoading}
          />
          
          <Select
            value={form.type}
            onValueChange={(value: 'public' | 'private') => setForm(f => ({ ...f, type: value }))}
            disabled={isLoading}
          >
            <SelectTrigger>
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="public">Público</SelectItem>
              <SelectItem value="private">Privado</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !form.name}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Cadastrar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
