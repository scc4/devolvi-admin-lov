
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Loader2, Trash2 } from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CollectionPoint, DayOfWeek, daysOfWeek, daysOfWeekPtBr } from "@/types/collection-point";

interface CollectionPointFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (point: Partial<CollectionPoint>) => Promise<void>;
  initialData?: CollectionPoint;
  isLoading?: boolean;
  carrierContext?: {
    carrierId?: string;
  };
}

const defaultOperatingHours = {
  monday: [{ open: '08:00', close: '18:00' }],
  tuesday: [{ open: '08:00', close: '18:00' }],
  wednesday: [{ open: '08:00', close: '18:00' }],
  thursday: [{ open: '08:00', close: '18:00' }],
  friday: [{ open: '08:00', close: '18:00' }],
  saturday: [],
  sunday: []
};

export function CollectionPointFormDialog({
  open,
  onOpenChange,
  onSubmit,
  initialData,
  isLoading = false,
  carrierContext
}: CollectionPointFormDialogProps) {
  const [form, setForm] = useState<Partial<CollectionPoint>>({
    name: initialData?.name || "",
    address: initialData?.address || "",
    phone: initialData?.phone || "",
    street: initialData?.street || "",
    number: initialData?.number || "",
    complement: initialData?.complement || "",
    district: initialData?.district || "",
    zip_code: initialData?.zip_code || "",
    city: initialData?.city || "",
    state: initialData?.state || "",
    latitude: initialData?.latitude || null,
    longitude: initialData?.longitude || null,
    is_active: initialData?.is_active ?? true,
    operating_hours: initialData?.operating_hours || defaultOperatingHours,
    ...(initialData?.id ? { id: initialData.id } : {}),
    // Set carrier_id from carrierContext if available, or from initialData
    ...(carrierContext?.carrierId ? { carrier_id: carrierContext.carrierId } : {}),
    ...(initialData?.carrier_id && !carrierContext?.carrierId ? { carrier_id: initialData.carrier_id } : {}),
  });

  const handleSubmit = async () => {
    if (!form.name || !form.address || (!form.carrier_id && !carrierContext?.carrierId)) {
      alert("Por favor, preencha os campos obrigatórios: Nome, Endereço");
      return;
    }
    
    // If we have a carrierId in the context but not in the form, add it
    const pointData = {
      ...form,
      ...(carrierContext?.carrierId && !form.carrier_id ? { carrier_id: carrierContext.carrierId } : {})
    };
    
    await onSubmit(pointData);
    if (!initialData) {
      // Reset form if it's a new entry
      setForm({
        name: "",
        address: "",
        phone: "",
        street: "",
        number: "",
        complement: "",
        district: "",
        zip_code: "",
        city: "",
        state: "",
        latitude: null,
        longitude: null,
        is_active: true,
        operating_hours: defaultOperatingHours,
        ...(carrierContext?.carrierId ? { carrier_id: carrierContext.carrierId } : {}),
      });
    }
  };

  const handleTimeChange = (day: DayOfWeek, index: number, field: 'open' | 'close', value: string) => {
    setForm(prev => {
      const hours = { ...prev.operating_hours } as CollectionPoint['operating_hours'];
      if (!hours) return prev;
      
      if (!hours[day]) {
        hours[day] = [];
      }
      
      if (!hours[day][index]) {
        hours[day][index] = { open: '08:00', close: '18:00' };
      }
      
      hours[day][index][field] = value;
      
      return { ...prev, operating_hours: hours };
    });
  };

  const addTimePeriod = (day: DayOfWeek) => {
    setForm(prev => {
      const hours = { ...prev.operating_hours } as CollectionPoint['operating_hours'];
      if (!hours) return prev;
      
      if (!hours[day]) {
        hours[day] = [];
      }
      
      hours[day].push({ open: '08:00', close: '18:00' });
      
      return { ...prev, operating_hours: hours };
    });
  };

  const removeTimePeriod = (day: DayOfWeek, index: number) => {
    setForm(prev => {
      const hours = { ...prev.operating_hours } as CollectionPoint['operating_hours'];
      if (!hours || !hours[day]) return prev;
      
      hours[day].splice(index, 1);
      
      return { ...prev, operating_hours: hours };
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Editar' : 'Cadastrar'} Ponto de Coleta</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="basic" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="basic">Dados Básicos</TabsTrigger>
            <TabsTrigger value="address">Endereço</TabsTrigger>
            <TabsTrigger value="hours">Horário de Funcionamento</TabsTrigger>
          </TabsList>

          <TabsContent value="basic" className="space-y-4 py-4">
            <div className="grid grid-cols-1 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Nome do Ponto de Coleta *</Label>
                <Input
                  id="name"
                  placeholder="Nome do ponto de coleta"
                  value={form.name || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, name: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Telefone</Label>
                <Input
                  id="phone"
                  placeholder="Telefone de contato"
                  value={form.phone || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, phone: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              <div className="flex items-center space-x-2">
                <Switch 
                  id="is_active" 
                  checked={form.is_active || false}
                  onCheckedChange={(checked) => setForm(prev => ({ ...prev, is_active: checked }))}
                  disabled={isLoading}
                />
                <Label htmlFor="is_active">Ponto de coleta ativo</Label>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="address" className="space-y-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="street">Rua</Label>
                <Input
                  id="street"
                  placeholder="Rua"
                  value={form.street || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, street: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="number">Número</Label>
                <Input
                  id="number"
                  placeholder="Número"
                  value={form.number || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, number: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="complement">Complemento</Label>
                <Input
                  id="complement"
                  placeholder="Complemento"
                  value={form.complement || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, complement: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="district">Bairro</Label>
                <Input
                  id="district"
                  placeholder="Bairro"
                  value={form.district || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, district: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="zip_code">CEP</Label>
                <Input
                  id="zip_code"
                  placeholder="CEP"
                  value={form.zip_code || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, zip_code: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="city">Cidade</Label>
                <Input
                  id="city"
                  placeholder="Cidade"
                  value={form.city || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, city: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="state">Estado</Label>
                <Input
                  id="state"
                  placeholder="Estado"
                  value={form.state || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, state: e.target.value }))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Endereço Completo *</Label>
                <Input
                  id="address"
                  placeholder="Endereço completo"
                  value={form.address || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, address: e.target.value }))}
                  disabled={isLoading}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="latitude">Latitude</Label>
                <Input
                  id="latitude"
                  type="number"
                  placeholder="Latitude"
                  value={form.latitude?.toString() || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, latitude: e.target.value ? parseFloat(e.target.value) : null }))}
                  disabled={isLoading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="longitude">Longitude</Label>
                <Input
                  id="longitude"
                  type="number"
                  placeholder="Longitude"
                  value={form.longitude?.toString() || ''}
                  onChange={(e) => setForm(prev => ({ ...prev, longitude: e.target.value ? parseFloat(e.target.value) : null }))}
                  disabled={isLoading}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="hours" className="space-y-6 py-4">
            {daysOfWeek.map(day => (
              <div key={day} className="border-b pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium">{daysOfWeekPtBr[day]}</h3>
                  <Button 
                    type="button" 
                    variant="outline" 
                    size="sm"
                    onClick={() => addTimePeriod(day)}
                    disabled={isLoading}
                  >
                    Adicionar Horário
                  </Button>
                </div>
                
                {(!form.operating_hours?.[day] || form.operating_hours[day].length === 0) ? (
                  <p className="text-muted-foreground text-sm">Fechado neste dia</p>
                ) : (
                  <div className="space-y-2">
                    {form.operating_hours[day].map((period, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Input 
                          type="time"
                          value={period.open}
                          onChange={(e) => handleTimeChange(day, index, 'open', e.target.value)}
                          className="w-32"
                          disabled={isLoading}
                        />
                        <span>até</span>
                        <Input 
                          type="time"
                          value={period.close}
                          onChange={(e) => handleTimeChange(day, index, 'close', e.target.value)}
                          className="w-32"
                          disabled={isLoading}
                        />
                        <Button 
                          type="button"
                          variant="ghost" 
                          size="icon"
                          onClick={() => removeTimePeriod(day, index)}
                          disabled={isLoading}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="ghost" onClick={() => onOpenChange(false)} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleSubmit} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Salvando...
              </>
            ) : (
              'Salvar'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
