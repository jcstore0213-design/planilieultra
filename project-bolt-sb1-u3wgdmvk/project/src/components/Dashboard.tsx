import React, { useState, useEffect } from 'react';
import { Users, DollarSign, TrendingUp, AlertTriangle, Plus, Search, Filter, RefreshCw, Download, Upload, Settings, Package } from 'lucide-react';
import { Client, Activity } from '../types';
import { useSupabaseClients } from '../hooks/useSupabaseClients';
import { useSupabaseActivity } from '../hooks/useSupabaseActivity';
import ClientCard from './ClientCard';
import AddClientModal from './AddClientModal';
import EditClientModal from './EditClientModal';
import ImportCSVModal from './ImportCSVModal';
import PlanPricingModal from './PlanPricingModal';
import ClientChart from './ClientChart';
import ImportExportButtons from './ImportExportButtons';

interface DashboardProps {
  userType: 'dono' | 'socio';
  onLogout: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ userType, onLogout }) => {
  const { 
    clients, 
    loading, 
    error, 
    addClient, 
    editClient, 
    deleteClient, 
    importClientsFromCSV,
    refreshClients 
  } = useSupabaseClients(userType);
  
  const { activities, refreshActivities } = useSupabaseActivity(userType);

  const [showAddModal, setShowAddModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [showPricingModal, setShowPricingModal] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [showExpiring, setShowExpiring] = useState(false);
  const [currentTab, setCurrentTab] = useState<'clients' | 'settings'>('clients');
  const [planPricing, setPlanPricing] = useState([
    { name: 'Básico', price: 30, description: 'Plano básico com canais essenciais' },
    { name: 'Premium', price: 50, description: 'Plano premium com mais canais e qualidade HD' },
    { name: 'Ultimate', price: 70, description: 'Plano completo com todos os canais e 4K' }
  ]);

  // Filtrar clientes
  const filteredClients = clients.filter(client => {
    const matchesSearch = client.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.phone?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         client.mac_address?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'todos' || client.status === statusFilter;
    
    const isExpiring = showExpiring ? 
      new Date(client.expiry_date) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) : true;
    
    return matchesSearch && matchesStatus && isExpiring;
  });

  // Calcular métricas
  const activeClients = clients.filter(c => c.status === 'ativo').length;
  const totalRevenue = clients.reduce((sum, c) => sum + (c.monthlyValue || 0), 0);
  const totalCredits = clients.reduce((sum, c) => sum + (c.credits || 0), 0);
  const expiringClients = clients.filter(c => 
    new Date(c.expiry) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  ).length;

  const handleAddClient = async (clientData: Omit<Client, 'id'>) => {
    await addClient(clientData);
    setShowAddModal(false);
  };

  const handleUpdateClient = async (clientData: Client) => {
    if (editingClient) {
      await editClient(clientData);
      setEditingClient(null);
    }
  };

  const handleDeleteClient = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este cliente?')) {
      await deleteClient(id);
    }
  };

  const handleImportCSV = async (csvData: string) => {
    return await importClientsFromCSV(csvData);
  };

  const handleSavePlanPricing = async (plans: typeof planPricing) => {
    setPlanPricing(plans);
    // Salvar no localStorage ou Supabase conforme necessário
    localStorage.setItem(`planPricing_${userType}`, JSON.stringify(plans));
  };

  const handleRefresh = () => {
    refreshClients();
    refreshActivities();
  };

  // Carregar preços dos planos do localStorage
  useEffect(() => {
    const saved = localStorage.getItem(`planPricing_${userType}`);
    if (saved) {
      setPlanPricing(JSON.parse(saved));
    }
  }, [userType]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <RefreshCw className="w-8 h-8 text-green-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-300">Carregando dados...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <AlertTriangle className="w-8 h-8 text-red-500 mx-auto mb-4" />
          <p className="text-red-400 mb-4">Erro ao carregar dados: {error}</p>
          <button
            onClick={handleRefresh}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
          >
            Tentar Novamente
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white">
      {/* Header */}
      <header className="bg-gray-800 border-b border-gray-700 p-4">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-green-400">
              Dashboard {userType === 'dono' ? 'Dono' : 'Sócio'}
            </h1>
            <p className="text-gray-400">Gestão IPTV Profissional</p>
          </div>
          <div className="flex items-center gap-4">
            {/* Tabs */}
            <div className="flex bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setCurrentTab('clients')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === 'clients'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Users size={16} className="inline mr-2" />
                Clientes
              </button>
              <button
                onClick={() => setCurrentTab('settings')}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  currentTab === 'settings'
                    ? 'bg-green-600 text-white'
                    : 'text-gray-300 hover:text-white'
                }`}
              >
                <Settings size={16} className="inline mr-2" />
                Configurações
              </button>
            </div>
            
            <button
              onClick={handleRefresh}
              className="p-2 bg-gray-700 rounded-lg hover:bg-gray-600 transition-colors"
              title="Atualizar dados"
            >
              <RefreshCw className="w-5 h-5" />
            </button>
            <button
              onClick={onLogout}
              className="px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700 transition-colors"
            >
              Sair
            </button>
          </div>
        </div>
      </header>

      <div className="p-6">
        {currentTab === 'clients' ? (
          <>
            {/* Cards de Métricas */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Clientes Ativos</p>
                    <p className="text-2xl font-bold text-green-400">{activeClients}</p>
                  </div>
                  <Users className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Receita Mensal</p>
                    <p className="text-2xl font-bold text-green-400">R$ {totalRevenue.toFixed(2)}</p>
                  </div>
                  <DollarSign className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Total Créditos</p>
                    <p className="text-2xl font-bold text-green-400">R$ {totalCredits.toFixed(2)}</p>
                  </div>
                  <TrendingUp className="w-8 h-8 text-green-500" />
                </div>
              </div>

              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-gray-400 text-sm">Vencendo</p>
                    <p className="text-2xl font-bold text-yellow-400">{expiringClients}</p>
                  </div>
                  <AlertTriangle className="w-8 h-8 text-yellow-500" />
                </div>
              </div>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
              <ClientChart clients={clients} />
              
              {/* Atividades Recentes */}
              <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
                <h3 className="text-lg font-semibold mb-4 text-green-400">Atividades Recentes</h3>
                <div className="space-y-3 max-h-64 overflow-y-auto">
                  {activities.slice(0, 10).map((activity) => (
                    <div key={activity.id} className="flex items-center justify-between p-3 bg-gray-700 rounded-lg">
                      <div>
                        <p className="text-sm text-white">{activity.description}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(activity.timestamp).toLocaleString('pt-BR')}
                        </p>
                      </div>
                      <span className="text-xs text-green-400 font-medium">
                        {activity.userType}
                      </span>
                    </div>
                  ))}
                  {activities.length === 0 && (
                    <p className="text-gray-400 text-center py-4">Nenhuma atividade registrada</p>
                  )}
                </div>
              </div>
            </div>

            {/* Controles */}
            <div className="flex flex-col lg:flex-row gap-4 mb-6">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Buscar por nome, telefone ou MAC..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:border-green-500"
                  />
                </div>
              </div>
              
              <div className="flex gap-2">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg text-white focus:outline-none focus:border-green-500"
                >
                  <option value="todos">Todos Status</option>
                  <option value="ativo">Ativo</option>
                  <option value="inativo">Inativo</option>
                  <option value="suspenso">Suspenso</option>
                  <option value="cancelado">Cancelado</option>
                </select>

                <button
                  onClick={() => setShowExpiring(!showExpiring)}
                  className={`px-4 py-3 rounded-lg transition-colors ${
                    showExpiring 
                      ? 'bg-yellow-600 text-white' 
                      : 'bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700'
                  }`}
                >
                  <Filter className="w-5 h-5" />
                </button>

                <ImportExportButtons 
                  clients={filteredClients}
                  onImport={handleRefresh}
                  userType={userType}
                />

                <button
                  onClick={() => setShowImportModal(true)}
                  className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                  <Upload className="w-5 h-5" />
                  Importar CSV
                </button>

                <button
                  onClick={() => setShowAddModal(true)}
                  className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" />
                  Adicionar Cliente
                </button>
              </div>
            </div>

            {/* Lista de Clientes */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredClients.map((client) => (
                <ClientCard
                  key={client.id}
                  client={client}
                  onEdit={setEditingClient}
                  onDelete={handleDeleteClient}
                  onToggleStatus={() => {}}
                  onRenewClient={() => {}}
                  onUpdateCredits={() => {}}
                />
              ))}
            </div>

            {filteredClients.length === 0 && (
              <div className="text-center py-12">
                <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <p className="text-gray-400 text-lg">Nenhum cliente encontrado</p>
                <p className="text-gray-500">Adicione clientes ou ajuste os filtros</p>
              </div>
            )}
          </>
        ) : (
          /* Aba de Configurações */
          <div className="space-y-8">
            <div className="bg-gray-800 p-6 rounded-xl border border-gray-700">
              <h3 className="text-xl font-semibold text-white mb-6 flex items-center gap-2">
                <Package size={20} />
                Gerenciamento de Planos
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                {planPricing.map((plan, index) => (
                  <div key={index} className="bg-gray-700/50 p-4 rounded-lg border border-gray-600">
                    <h4 className="text-lg font-medium text-white mb-2">{plan.name}</h4>
                    <p className="text-2xl font-bold text-green-400 mb-2">R$ {plan.price.toFixed(2)}</p>
                    <p className="text-sm text-gray-400">{plan.description}</p>
                  </div>
                ))}
              </div>
              
              <button
                onClick={() => setShowPricingModal(true)}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center gap-2"
              >
                <Settings size={18} />
                Editar Planos e Preços
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Modals */}
      {showAddModal && (
        <AddClientModal
          onClose={() => setShowAddModal(false)}
          onAdd={handleAddClient}
          userType={userType}
        />
      )}

      {showImportModal && (
        <ImportCSVModal
          onClose={() => setShowImportModal(false)}
          onImport={handleImportCSV}
          userType={userType}
        />
      )}

      {showPricingModal && (
        <PlanPricingModal
          onClose={() => setShowPricingModal(false)}
          onSave={handleSavePlanPricing}
          currentPlans={planPricing}
        />
      )}

      {editingClient && (
        <EditClientModal
          client={editingClient}
          onClose={() => setEditingClient(null)}
          onSubmit={handleUpdateClient}
        />
      )}
    </div>
  );
};

export default Dashboard;