
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import type { EstablishmentWithDetails } from "@/types/establishment";

interface EstablishmentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (establishment: Partial<EstablishmentWithDetails>) => Promise<void>;
  initialData?: EstablishmentWithDetails;
  isLoading?: boolean;
}

export function EstablishmentFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false
}: EstablishmentFormDialogProps) {
  const [form, setForm] = useState<{
    name: string;
    type: 'public' | 'private';
  }>({
    name: initialData?.name || "",
    type: initialData?.type as 'public' | 'private' || "public"
  });

  const handleSubmit = async () => {
    await onSubmit({
      ...form,
      ...(initialData?.id ? { id: initialData.id } : {})
    });
    if (!initialData) {
      setForm({ name: "", type: "public" });
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar' : 'Cadastrar'} Estabelecimento</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <Input
            placeholder="Nome do Estabelecimento"
            value={form.name}
            onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
            disabled={isLoading}
          />
          
          <Select
            value={form.type}
            onValueChange={(value: 'public' | 'private') => setForm(prev => ({ ...prev, type: value }))}
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
              initialData ? 'Salvar' : 'Cadastrar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
