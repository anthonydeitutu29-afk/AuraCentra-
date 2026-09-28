export interface Business {
  id: string;
  name: string;
  category: string;
  description: string;
  region: string;
  city?: string;
  address?: string;
  phone: string;
  whatsapp?: string;
  email?: string;
  website?: string;
  verified: boolean;
  featured?: boolean;
  status: 'pending' | 'approved' | 'rejected';
  ghana_card_number?: string;
  tin_number?: string;
  operating_hours?: string;
  logo_url?: string;
  cover_image?: string;
  rating?: number;
  reviews_count?: number;
  created_at: string;
  updated_at?: string;
}

export type BusinessInsert = Omit<Business, 'id' | 'created_at' | 'updated_at' | 'verified' | 'status'> & {
  id?: string;
  verified?: boolean;
  status?: 'pending' | 'approved' | 'rejected';
};

export interface SupabaseDiagnosticResult {
  connected: boolean;
  hasEnvVars: boolean;
  tableExists: boolean;
  canRead: boolean;
  canInsert: boolean;
  rlsStatus: string;
  lastError: {
    message?: string;
    code?: string;
    details?: string;
    hint?: string;
    status?: number;
  } | null;
}
