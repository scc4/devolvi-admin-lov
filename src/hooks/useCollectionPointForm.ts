
import { useState } from "react";
import type { CollectionPoint, DayOfWeek } from "@/types/collection-point";

const defaultOperatingHours = {
  monday: [{ open: '08:00', close: '18:00' }],
  tuesday: [{ open: '08:00', close: '18:00' }],
  wednesday: [{ open: '08:00', close: '18:00' }],
  thursday: [{ open: '08:00', close: '18:00' }],
  friday: [{ open: '08:00', close: '18:00' }],
  saturday: [],
  sunday: []
};

export function useCollectionPointForm(
  initialData?: CollectionPoint,
  carrierContext?: {
    carrierId?: string;
  }
) {
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
    ...(carrierContext?.carrierId ? { carrier_id: carrierContext.carrierId } : {}),
    ...(initialData?.carrier_id ? { carrier_id: initialData.carrier_id } : {}),
  });

  const handleInputChange = (field: keyof CollectionPoint, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
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

  return {
    form,
    handleInputChange,
    handleTimeChange,
    addTimePeriod,
    removeTimePeriod,
  };
}
