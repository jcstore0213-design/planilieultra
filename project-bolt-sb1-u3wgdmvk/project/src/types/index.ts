export type UserType = 'dono' | 'socio';

export interface Client {
  id: string;
  name: string;
  phone: string;
  plan: string;
  mac?: string;
  activation: string;
  expiry: string;
  status: 'ativo' | 'inativo' | 'suspenso';
  credits: number;
  monthlyValue?: number;
  userType: UserType;
  notes?: string;
  id: string;
  type: 'client_added' | 'client_updated' | 'client_deleted' | 'status_changed' | 'client_renewed' | 'export';
  description: string;
  clientId?: string | null;
  timestamp: string;
  userType: UserType;
  createdAt: string;
}

export interface User {
  type: UserType;
  isAuthenticated: boolean;
}
  clientId?: string | null;