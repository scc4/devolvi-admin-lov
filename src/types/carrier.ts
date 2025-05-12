
export interface Carrier {
  id: string;
  name: string;
  city: string;
  manager: string;
  phone: string | null;
  email: string | null;
  is_active?: boolean;
  created_at?: string;
  updated_at?: string;
  collection_points_count?: number;
}
