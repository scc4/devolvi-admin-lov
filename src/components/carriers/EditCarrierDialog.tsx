import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { maskPhoneBR } from "@/lib/format";
import type { Carrier } from "@/types/carrier";
import { useState, useEffect } from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";
import { Checkbox } from "@/components/ui/checkbox";

interface EditCarrierDialogProps {
  carrier: Carrier;
  onClose: () => void;
  onSave: (carrier: Carrier) => Promise<void>;
  isSubmitting?: boolean;
}

export function EditCarrierDialog({
  carrier,
  onClose,
  onSave,
  isSubmitting = false
}: EditCarrierDialogProps) {
  const [formData, setFormData] = useState<Carrier>({ ...carrier });
  const [states, setStates] = useState<{ value: string; label: string; }[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [isLoadingCities, setIsLoadingCities] = useState(false);

  useEffect(() => {
    const loadStates = async () => {
      const ibgeStates = await fetchStates();
      setStates(ibgeStates.map(state => ({
        value: state.sigla,
        label: `${state.nome} (${state.sigla})`
      })));
    };
    loadStates();
  }, []);

  useEffect(() => {
    const loadCities = async () => {
      if (formData.state) {
        setIsLoadingCities(true);
        const cities = await fetchCitiesByState(formData.state);
        setAvailableCities(cities.map(city => city.nome));
        setIsLoadingCities(false);
      } else {
        setAvailableCities([]);
      }
    };
    loadCities();
  }, [formData.state]);

  // Load initial data when dialog opens or carrier changes
  useEffect(() => {
    setFormData({ ...carrier });
  }, [carrier]);

  // Ensure proper cleanup when dialog is closed
  useEffect(() => {
    const handleEscapeKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape' && !isSubmitting) {
        onClose();
      }
    };

    document.addEventListener('keydown', handleEscapeKey);
    
    return () => {
      document.removeEventListener('keydown', handleEscapeKey);
      
      setTimeout(() => {
        document.body.style.pointerEvents = '';
        const overlays = document.querySelectorAll('[data-radix-portal]');
        overlays.forEach(overlay => {
          if (!overlay.contains(document.activeElement)) {
            (overlay as HTMLElement).style.display = 'none';
          }
        });
      }, 300);
    };
  }, [isSubmitting, onClose]);

  const handlePhoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const maskedValue = maskPhoneBR(e.target.value);
    setFormData(prev => ({ ...prev, phone: maskedValue }));
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    await onSave(formData);
  };

  return (
    <Dialog open onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{carrier.id ? 'Editar' : 'Nova'} Transportadora</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Nome da transportadora"
              value={formData.name || ''}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="state">Estado</Label>
            <Select
              value={formData.state || ''}
              onValueChange={(value) => setFormData(prev => ({ ...prev, state: value, city: '' }))}
              disabled={isSubmitting}
            >
              <SelectTrigger id="state">
                <SelectValue placeholder={states.length ? "Selecione o estado" : "Carregando estados..."} />
              </SelectTrigger>
              <SelectContent>
                {states.map((state) => (
                  <SelectItem key={state.value} value={state.value}>
                    {state.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="city">Cidade</Label>
            <Select
              value={formData.city || ''}
              onValueChange={(value) => setFormData(prev => ({ ...prev, city: value }))}
              disabled={isSubmitting || !formData.state || isLoadingCities}
            >
              <SelectTrigger id="city">
                <SelectValue 
                  placeholder={
                    isLoadingCities 
                      ? "Carregando cidades..." 
                      : formData.state 
                        ? "Selecione a cidade" 
                        : "Selecione um estado primeiro"
                  } 
                />
              </SelectTrigger>
              <SelectContent>
                {availableCities.map((city) => (
                  <SelectItem key={city} value={city}>
                    {city}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="manager">Gestor Responsável</Label>
            <Input
              id="manager"
              placeholder="Gestor responsável"
              value={formData.manager || ''}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="phone">Telefone</Label>
            <Input
              id="phone"
              placeholder="(00) 00000-0000"
              type="tel"
              inputMode="tel"
              value={formData.phone || ''}
              onChange={handlePhoneChange}
              disabled={isSubmitting}
              maxLength={15}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="Email"
              value={formData.email || ''}
              onChange={handleChange}
              disabled={isSubmitting}
            />
          </div>

          <div className="flex items-center space-x-2">
            <Checkbox
              id="is_active"
              checked={formData.is_active || false}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
              disabled={isSubmitting}
            />
            <Label htmlFor="is_active">Transportadora ativa</Label>
          </div>

          <DialogFooter>
            <Button type="button" variant="ghost" onClick={onClose} disabled={isSubmitting}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Salvando...
                </>
              ) : (
                'Salvar'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
