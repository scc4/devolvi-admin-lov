
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import type { EstablishmentWithDetails } from "@/types/establishment";
import { toast } from "sonner";

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
    name: "",
    type: "public"
  });

  // Load initial data when dialog opens or initialData changes
  useEffect(() => {
    if (initialData) {
      setForm({
        name: initialData.name,
        type: initialData.type as 'public' | 'private'
      });
    } else {
      // Reset form when creating new
      setForm({
        name: "",
        type: "public"
      });
    }
  }, [initialData, open]);

  // Ensure proper cleanup when dialog is closed
  useEffect(() => {
    if (!open) {
      const timeout = setTimeout(() => {
        document.body.style.pointerEvents = '';
        const overlays = document.querySelectorAll('[data-radix-portal]');
        overlays.forEach(overlay => {
          if (!overlay.contains(document.activeElement)) {
            (overlay as HTMLElement).style.display = 'none';
          }
        });
      }, 300);
      
      return () => clearTimeout(timeout);
    }
  }, [open]);

  const handleSubmit = async () => {
    if (!form.name) {
      toast.error("O nome do estabelecimento é obrigatório");
      return;
    }
    
    try {
      await onSubmit({
        ...form,
        ...(initialData?.id ? { id: initialData.id } : {})
      });
    } catch (error) {
      console.error("Error submitting establishment:", error);
      toast.error("Erro ao salvar estabelecimento. Tente novamente.");
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
            <SelectTrigger className="z-[100]">
              <SelectValue placeholder="Selecione o tipo" />
            </SelectTrigger>
            <SelectContent className="z-[101]">
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
