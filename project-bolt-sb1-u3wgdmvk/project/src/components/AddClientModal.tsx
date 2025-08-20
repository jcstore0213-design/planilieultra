import React, { useState } from 'react';
import { X, Save, User, Phone, Wifi, Calendar, DollarSign } from 'lucide-react';
import { Client, UserType } from '../types';

interface AddClientModalProps {
  onAdd: (client: Omit<Client, 'id'>) => Promise<void>;
  onClose: () => void;
  userType: UserType;
}

const AddClientModal: React.FC<AddClientModalProps> = ({ onAdd, onClose, userType }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    plan: 'Básico',
    mac: '',
    activation: new Date().toISOString().split('T')[0],
    expiry: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    status: 'ativo' as const,
    credits: 0,
    notes: '',
    userType: userType
  });

  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      // Set credits based on plan
      const planCredits = {
        'Básico': 30,
        'Premium': 50,
        'Ultimate': 70
      };
      
      await onAdd({
        ...formData,
        credits: planCredits[formData.plan as keyof typeof planCredits] || 30,
        monthlyValue: planCredits[formData.plan as keyof typeof planCredits] || 30
      });
      
      onClose();
    } catch (error) {
      console.error('Erro ao adicionar cliente:', error);
      alert('Erro ao adicionar cliente. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <User size={20} />
            Novo Cliente
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Nome */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User size={16} className="inline mr-1" />
              Nome Completo
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Digite o nome do cliente"
              required
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Phone size={16} className="inline mr-1" />
              Telefone
            </label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="(11) 99999-9999"
              required
            />
          </div>

          {/* Plano */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Wifi size={16} className="inline mr-1" />
              Plano IPTV
            </label>
            <select
              name="plan"
              value={formData.plan}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Básico">Básico - R$ 30,00/mês</option>
              <option value="Premium">Premium - R$ 50,00/mês</option>
              <option value="Ultimate">Ultimate - R$ 70,00/mês</option>
            </select>
          </div>

          {/* MAC Address */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              MAC Address
            </label>
            <input
              type="text"
              name="mac"
              value={formData.mac}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="00:00:00:00:00:00"
            />
          </div>

          {/* Data de Ativação */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Data de Ativação
            </label>
            <input
              type="date"
              name="activation"
              value={formData.activation}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Data de Vencimento */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Calendar size={16} className="inline mr-1" />
              Data de Vencimento
            </label>
            <input
              type="date"
              name="expiry"
              value={formData.expiry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status Inicial</label>
            <select
              name="status"
              value={formData.status}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="ativo">Ativo</option>
              <option value="inativo">Inativo</option>
              <option value="suspenso">Suspenso</option>
            </select>
          </div>

          {/* Notas */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Notas Internas</label>
            <textarea
              name="notes"
              value={formData.notes}
              onChange={handleInputChange}
              rows={3}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
              placeholder="Observações sobre o cliente..."
            />
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {loading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Save size={18} />
              )}
              {loading ? 'Salvando...' : 'Adicionar Cliente'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddClientModal;