
export interface Establishment {
  id: string;
  name: string;
  type: 'public' | 'private';
  carrier_id?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface EstablishmentManager {
  id: string;
  establishment_id: string;
  user_id: string;
  created_at?: string;
}
