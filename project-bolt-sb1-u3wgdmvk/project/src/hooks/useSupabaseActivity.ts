import { useState, useEffect, useCallback } from 'react';
import { Activity, UserType } from '../types';

export const useSupabaseActivity = (userType: UserType) => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Since activities table doesn't exist, we'll use local storage as fallback
  const loadActivities = useCallback(async () => {
    try {
      setLoading(true);
      
      // Load from localStorage as fallback since activities table doesn't exist
      const stored = localStorage.getItem(`activities_${userType}`);
      const storedActivities = stored ? JSON.parse(stored) : [];
      
      setActivities(storedActivities);
      setError(null);
    } catch (err) {
      console.error('Erro ao carregar atividades:', err);
      setError('Erro ao carregar atividades');
    } finally {
      setLoading(false);
    }
  }, [userType]);

  // Adicionar atividade
  const addActivity = async (type: Activity['type'], description: string, clientId?: string) => {
    try {
      const newActivity: Activity = {
        id: crypto.randomUUID(),
        type,
        description,
        clientId: clientId || null,
        userType,
        timestamp: new Date().toISOString(),
        createdAt: new Date().toISOString()
      };

      const stored = localStorage.getItem(`activities_${userType}`);
      const existingActivities = stored ? JSON.parse(stored) : [];
      const updatedActivities = [newActivity, ...existingActivities].slice(0, 50); // Keep only last 50

      localStorage.setItem(`activities_${userType}`, JSON.stringify(updatedActivities));
      setActivities(updatedActivities);
    } catch (err) {
      console.error('Erro ao adicionar atividade:', err);
    }
  };

  // Limpar atividades
  const clearActivities = async () => {
    try {
      localStorage.removeItem(`activities_${userType}`);
      setActivities([]);
    } catch (err) {
      console.error('Erro ao limpar atividades:', err);
      throw new Error('Erro ao limpar atividades');
    }
  };

  // Carregar dados na inicialização
  useEffect(() => {
    loadActivities();
  }, [loadActivities]);

  return {
    activities,
    loading,
    error,
    addActivity,
    clearActivities,
    refreshActivities: loadActivities
  };
};