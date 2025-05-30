
export interface CollectionPoint {
  id: string;
  name: string;
  address?: string;
  establishment_id: string | null;
  establishment?: {
    name: string;
  } | null;
  carrier_id: string;
  phone: string | null;
  address_id: string | null;
  is_active: boolean | null;
  pudo?: boolean | null;
  operating_hours: {
    [day: string]: {
      open: string;
      close: string;
    }[];
  } | null;
  created_at: string;
  updated_at: string;
  address_obj?: Address | null;
}

export interface Address {
  id?: string;
  street: string | null;
  number: string | null;
  complement: string | null;
  district: string | null;
  city: string | null;
  state: string | null;
  zip_code: string | null;
  latitude: number | null;
  longitude: number | null;
  created_at?: string;
  updated_at?: string | null;
}

// For form operations, we need a version of Address where all fields can be partial
export type AddressFormData = Partial<Address>;

export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export const daysOfWeek: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

export const daysOfWeekPtBr: Record<DayOfWeek, string> = {
  monday: 'Segunda-feira',
  tuesday: 'Terça-feira',
  wednesday: 'Quarta-feira',
  thursday: 'Quinta-feira',
  friday: 'Sexta-feira',
  saturday: 'Sábado',
  sunday: 'Domingo'
};
