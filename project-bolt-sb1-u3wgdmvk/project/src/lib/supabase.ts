import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type Database = {
  public: {
    Tables: {
      clients: {
        Row: {
          id: string;
          name: string;
          phone: string;
          plan: string;
          mac: string;
          activation: string;
          expiry: string;
          status: 'ativo' | 'inativo' | 'suspenso';
          credits: number;
          notes: string | null;
          user_type: 'dono' | 'socio';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          phone: string;
          plan: string;
          mac: string;
          activation: string;
          expiry: string;
          status: 'ativo' | 'inativo' | 'suspenso';
          credits: number;
          notes?: string | null;
          user_type: 'dono' | 'socio';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          phone?: string;
          plan?: string;
          mac?: string;
          activation?: string;
          expiry?: string;
          status?: 'ativo' | 'inativo' | 'suspenso';
          credits?: number;
          notes?: string | null;
          user_type?: 'dono' | 'socio';
          created_at?: string;
          updated_at?: string;
        };
      };
      activities: {
        Row: {
          id: string;
          type: string;
          description: string;
          client_id: string | null;
          user_type: 'dono' | 'socio';
          timestamp: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          type: string;
          description: string;
          client_id?: string | null;
          user_type: 'dono' | 'socio';
          timestamp?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          type?: string;
          description?: string;
          client_id?: string | null;
          user_type?: 'dono' | 'socio';
          timestamp?: string;
          created_at?: string;
        };
      };
      backups: {
        Row: {
          id: string;
          action: string;
          data: any;
          user_type: 'dono' | 'socio';
          created_at: string;
        };
        Insert: {
          id?: string;
          action: string;
          data: any;
          user_type: 'dono' | 'socio';
          created_at?: string;
        };
        Update: {
          id?: string;
          action?: string;
          data?: any;
          user_type?: 'dono' | 'socio';
          created_at?: string;
        };
      };
    };
  };
};