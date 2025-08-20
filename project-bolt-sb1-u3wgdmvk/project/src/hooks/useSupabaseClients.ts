import { useState, useEffect, useCallback } from 'react';
import { supabase } from '../lib/supabase';
import { Client, UserType } from '../types';
import { v4 as uuidv4 } from 'uuid';

export const useSupabaseClients = (userType: UserType) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Carregar clientes do Supabase
  const loadClients = useCallback(async () => {
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('clients')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Filter clients by userType in memory since user_type column doesn't exist
      const filteredClients = (data || []).map(client => ({
        ...client,
        user_type: client.user_type || userType // Add user_type if missing
      })).filter(client => client.user_type === userType);
      
      setClients(filteredClients);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar clientes:', err);
      setError('Erro ao carregar clientes');
    } finally {
      setLoading(false);
    }
  }, [userType]);

  // Adicionar cliente
  const addClient = async (clientData: Omit<Client, 'id'>) => {
    try {
      const newClient = {
        name: clientData.name,
        phone: clientData.phone || null,
        plan: clientData.plan,
        mac_address: clientData.mac || null,
        activation_date: clientData.activation,
        expiry_date: clientData.expiry,
        status: clientData.status || 'ativo',
        credits: clientData.credits || 0,
        monthly_value: clientData.monthlyValue || getPlanPrice(clientData.plan),
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };

      const { data, error } = await supabase
        .from('clients')
        .insert(newClient)
        .select()
        .single();

      if (error) throw error;

      await loadClients();
      
      return data;
    } catch (err) {
      console.error('Erro ao adicionar cliente:', err);
      throw new Error('Erro ao adicionar cliente');
    }
  };

  // Editar cliente
  const editClient = async (updatedClient: Client) => {
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: updatedClient.name,
          phone: updatedClient.phone,
          plan: updatedClient.plan,
          mac_address: updatedClient.mac,
          activation_date: updatedClient.activation,
          expiry_date: updatedClient.expiry,
          status: updatedClient.status,
          credits: updatedClient.credits,
          monthly_value: updatedClient.monthlyValue || getPlanPrice(updatedClient.plan),
          updated_at: new Date().toISOString()
        })
        .eq('id', updatedClient.id);

      if (error) throw error;

      await loadClients();
    } catch (err) {
      console.error('Erro ao editar cliente:', err);
      throw new Error('Erro ao editar cliente');
    }
  };

  // Excluir cliente
  const deleteClient = async (id: string) => {
    try {
      const { error } = await supabase
        .from('clients')
        .delete()
        .eq('id', id);

      if (error) throw error;

      await loadClients();
    } catch (err) {
      console.error('Erro ao excluir cliente:', err);
      throw new Error('Erro ao excluir cliente');
    }
  };

  // Alternar status do cliente
  const toggleClientStatus = async (id: string) => {
    try {
      const client = clients.find(c => c.id === id);
      if (!client) return;

      let newStatus: 'ativo' | 'inativo' | 'suspenso';
      switch (client.status) {
        case 'ativo':
          newStatus = 'suspenso';
          break;
        case 'suspenso':
          newStatus = 'inativo';
          break;
        case 'inativo':
          newStatus = 'ativo';
          break;
        default:
          newStatus = 'ativo';
      }

      await editClient({ ...client, status: newStatus });
    } catch (err) {
      console.error('Erro ao alterar status:', err);
      throw new Error('Erro ao alterar status');
    }
  };

  // Renovar cliente
  const renewClient = async (id: string) => {
    try {
      const client = clients.find(c => c.id === id);
      if (!client) return;

      const currentExpiry = new Date(client.expiry);
      const newExpiry = new Date(currentExpiry.getTime() + 30 * 24 * 60 * 60 * 1000);
      
      const updatedClient = {
        ...client,
        status: 'ativo' as const,
        expiry: newExpiry.toISOString().split('T')[0],
        credits: client.credits > 0 ? client.credits : getPlanPrice(client.plan)
      };

      await editClient(updatedClient);
    } catch (err) {
      console.error('Erro ao renovar cliente:', err);
      throw new Error('Erro ao renovar cliente');
    }
  };

  // Atualizar créditos
  const updateClientCredits = async (id: string, credits: number) => {
    try {
      const client = clients.find(c => c.id === id);
      if (!client) return;

      await editClient({ ...client, credits });
    } catch (err) {
      console.error('Erro ao atualizar créditos:', err);
      throw new Error('Erro ao atualizar créditos');
    }
  };

  // Importar clientes de CSV
  const importClientsFromCSV = async (csvData: string) => {
    try {
      const lines = csvData.split('\n');
      const headers = lines[0].split(',').map(h => h.trim());
      const clientsToImport = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length >= headers.length && values[0]) {
          const client = {
            name: values[0] || '',
            phone: values[1] || null,
            plan: values[2] || 'Básico',
            mac_address: values[3] || null,
            activation_date: values[4] || new Date().toISOString().split('T')[0],
            expiry_date: values[5] || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            status: (values[6] as 'ativo' | 'inativo' | 'suspenso') || 'ativo',
            credits: parseFloat(values[7]) || 0,
            monthly_value: getPlanPrice(values[2] || 'Básico'),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          };
          clientsToImport.push(client);
        }
      }

      if (clientsToImport.length > 0) {
        const { error } = await supabase.from('clients').insert(clientsToImport);
        if (error) throw error;

        await loadClients();
        
        return clientsToImport.length;
      }
      
      return 0;
    } catch (err) {
      console.error('Erro ao importar clientes:', err);
      throw new Error('Erro ao importar clientes');
    }
  };

  const getPlanPrice = (plan: string): number => {
    switch (plan) {
      case 'Básico': return 30;
      case 'Premium': return 50;
      case 'Ultimate': return 70;
      default: return 30;
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadClients();
  }, [loadClients]);

  // Configurar subscription para atualizações em tempo real
  useEffect(() => {
    const subscription = supabase
      .channel('clients_changes')
      .on('postgres_changes', 
        { 
          event: '*', 
          schema: 'public', 
          table: 'clients'
        }, 
        () => {
          loadClients();
        }
      )
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [loadClients]);

  return {
    clients,
    loading,
    error,
    addClient,
    editClient,
    deleteClient,
    toggleClientStatus,
    renewClient,
    updateClientCredits,
    importClientsFromCSV,
    refreshClients: loadClients
  };
};