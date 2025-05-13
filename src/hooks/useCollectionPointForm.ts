
import { useState, useEffect } from "react";
import type { CollectionPoint, DayOfWeek, Address } from "@/types/collection-point";

const defaultOperatingHours = {
  monday: [{ open: '08:00', close: '18:00' }],
  tuesday: [{ open: '08:00', close: '18:00' }],
  wednesday: [{ open: '08:00', close: '18:00' }],
  thursday: [{ open: '08:00', close: '18:00' }],
  friday: [{ open: '08:00', close: '18:00' }],
  saturday: [],
  sunday: [{ open: '08:00', close: '18:00' }]
};

export function useCollectionPointForm(
  initialData?: CollectionPoint & { address_obj?: Address },
  carrierContext?: {
    carrierId?: string;
  }
) {
  const [form, setForm] = useState<Partial<CollectionPoint> & { address_obj?: Partial<Address> }>({
    name: "",
    address: "",
    phone: "",
    is_active: true,
    operating_hours: defaultOperatingHours,
    address_id: null,
    address_obj: {
      street: "",
      number: "",
      complement: "",
      district: "",
      zip_code: "",
      city: "",
      state: "",
      latitude: null,
      longitude: null
    },
    ...(carrierContext?.carrierId ? { carrier_id: carrierContext.carrierId } : {}),
  });

  // Load initial data when provided
  useEffect(() => {
    if (initialData) {
      setForm({
        ...initialData,
        operating_hours: initialData.operating_hours || defaultOperatingHours,
        address_obj: initialData.address_obj || {
          street: "",
          number: "",
          complement: "",
          district: "",
          zip_code: "",
          city: "",
          state: "",
          latitude: null,
          longitude: null
        }
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof CollectionPoint, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressInputChange = (field: keyof Address, value: any) => {
    setForm(prev => ({
      ...prev,
      address_obj: {
        ...(prev.address_obj || {}),
        [field]: value
      }
    }));
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
    handleAddressInputChange,
    handleTimeChange,
    addTimePeriod,
    removeTimePeriod,
  };
}
