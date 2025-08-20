import React, { useState } from 'react';
import { X, Save, Calendar, DollarSign } from 'lucide-react';
import { Client } from '../types';

interface EditClientModalProps {
  client: Client;
  onSubmit: (client: Client) => void;
  onClose: () => void;
}

const EditClientModal: React.FC<EditClientModalProps> = ({ client, onSubmit, onClose }) => {
  const [formData, setFormData] = useState({
    name: client.name,
    phone: client.phone,
    plan: client.plan,
    mac: client.mac,
    activation: client.activation,
    expiry: client.expiry,
    status: client.status,
    credits: client.credits,
    notes: client.notes || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({
      ...client,
      ...formData
    });
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'number' ? parseFloat(value) || 0 : value
    }));
  };

  const addDaysToExpiry = (days: number) => {
    const currentExpiry = new Date(formData.expiry);
    const newExpiry = new Date(currentExpiry.getTime() + days * 24 * 60 * 60 * 1000);
    setFormData(prev => ({
      ...prev,
      expiry: newExpiry.toISOString().split('T')[0]
    }));
  };

  const addCredits = (amount: number) => {
    setFormData(prev => ({
      ...prev,
      credits: Math.max(0, prev.credits + amount)
    }));
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white">Editar Cliente</h2>
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
            <label className="block text-sm font-medium text-gray-300 mb-2">Nome</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Telefone */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Telefone</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              required
            />
          </div>

          {/* Plano */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Plano</label>
            <select
              name="plan"
              value={formData.plan}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
            >
              <option value="Básico">Básico - R$ 30,00</option>
              <option value="Premium">Premium - R$ 50,00</option>
              <option value="Ultimate">Ultimate - R$ 70,00</option>
            </select>
          </div>

          {/* MAC */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">MAC Address</label>
            <input
              type="text"
              name="mac"
              value={formData.mac}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="00:00:00:00:00:00"
            />
          </div>

          {/* Status */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Status</label>
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

          {/* Vencimento com botões rápidos */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Data de Vencimento</label>
            <input
              type="date"
              name="expiry"
              value={formData.expiry}
              onChange={handleInputChange}
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
              required
            />
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => addDaysToExpiry(30)}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
              >
                <Calendar size={14} />
                +30 dias
              </button>
              <button
                type="button"
                onClick={() => addDaysToExpiry(60)}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
              >
                <Calendar size={14} />
                +60 dias
              </button>
              <button
                type="button"
                onClick={() => addDaysToExpiry(90)}
                className="flex items-center gap-1 px-3 py-1 bg-green-600 hover:bg-green-700 text-white text-xs rounded-lg transition-colors"
              >
                <Calendar size={14} />
                +90 dias
              </button>
            </div>
          </div>

          {/* Créditos com botões rápidos */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Créditos</label>
            <input
              type="number"
              name="credits"
              value={formData.credits}
              onChange={handleInputChange}
              step="0.01"
              min="0"
              className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 mb-2"
            />
            <div className="flex gap-2 flex-wrap">
              <button
                type="button"
                onClick={() => addCredits(30)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
              >
                <DollarSign size={14} />
                +R$ 30
              </button>
              <button
                type="button"
                onClick={() => addCredits(50)}
                className="flex items-center gap-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-xs rounded-lg transition-colors"
              >
                <DollarSign size={14} />
                +R$ 50
              </button>
              <button
                type="button"
                onClick={() => addCredits(-10)}
                className="flex items-center gap-1 px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-xs rounded-lg transition-colors"
              >
                <DollarSign size={14} />
                -R$ 10
              </button>
            </div>
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
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
            >
              <Save size={18} />
              Salvar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditClientModal;