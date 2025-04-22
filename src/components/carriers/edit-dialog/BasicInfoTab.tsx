
import { useState } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { DialogFooter } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { fetchStates, fetchCitiesByState } from "@/services/ibge-api";
import { Checkbox } from "@/components/ui/checkbox";
import { maskPhoneBR } from "@/lib/format";
import type { Carrier } from "@/types/carrier";
import { useCarrierForm } from "./useCarrierForm";

interface BasicInfoTabProps {
  carrier: Carrier;
  onSave: (carrier: Carrier) => Promise<void>;
  onClose: () => void;
  isSubmitting?: boolean;
}

export function BasicInfoTab({ carrier, onSave, onClose, isSubmitting = false }: BasicInfoTabProps) {
  const { 
    formData, 
    states, 
    availableCities,
    isLoadingCities,
    handlePhoneChange,
    handleChange,
    handleSubmit,
    setFormData
  } = useCarrierForm(carrier, onSave);

  return (
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
          onCheckedChange={(checked) => {
            const isActive = checked === true;
            setFormData(prev => ({ ...prev, is_active: isActive }));
          }}
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
  );
}
