
import { useState, useEffect } from "react";
import type { CollectionPoint, DayOfWeek, Address } from "@/types/collection-point";

const defaultOperatingHours = {
  monday: [{ open: '08:00', close: '18:00' }],
  tuesday: [{ open: '08:00', close: '18:00' }],
  wednesday: [{ open: '08:00', close: '18:00' }],
  thursday: [{ open: '08:00', close: '18:00' }],
  friday: [{ open: '08:00', close: '18:00' }],
  saturday: [],
  sunday: []
};

// Default address for new collection points
const defaultAddressObj: Address = {
  street: null,
  number: null,
  complement: null,
  district: null,
  zip_code: null,
  city: null,
  state: null,
  latitude: null,
  longitude: null
};

export function useCollectionPointFormV2(
  initialData?: CollectionPoint,
  carrierContext?: {
    carrierId?: string;
  }
) {
  const [form, setForm] = useState<Partial<CollectionPoint> & { address_obj?: Address | null }>({
    name: "",
    phone: "",
    is_active: true,
    operating_hours: defaultOperatingHours,
    address_id: null,
    address_obj: { ...defaultAddressObj },
    ...(carrierContext?.carrierId ? { carrier_id: carrierContext.carrierId } : {}),
  });

  // Load initial data when provided
  useEffect(() => {
    if (initialData) {
      console.log("Loading initial data:", initialData);
      setForm({
        ...initialData,
        operating_hours: initialData.operating_hours || defaultOperatingHours,
        address_obj: initialData.address_obj || { ...defaultAddressObj }
      });
    }
  }, [initialData]);

  const handleInputChange = (field: keyof CollectionPoint, value: any) => {
    console.log(`Changing ${String(field)} to:`, value);
    setForm(prev => ({ ...prev, [field]: value }));
  };

  const handleAddressInputChange = (field: keyof Address, value: any) => {
    console.log(`Changing address.${String(field)} to:`, value);
    setForm(prev => {
      // Make sure address_obj is an object
      const currentAddressObj = prev.address_obj || { ...defaultAddressObj };
      
      return {
        ...prev,
        address_obj: {
          ...currentAddressObj,
          [field]: value
        }
      };
    });
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
