import React, { useState } from 'react';
import { X, Save, DollarSign, Package } from 'lucide-react';

interface PlanPricing {
  name: string;
  price: number;
  description: string;
}

interface PlanPricingModalProps {
  onClose: () => void;
  onSave: (plans: PlanPricing[]) => void;
  currentPlans: PlanPricing[];
}

const PlanPricingModal: React.FC<PlanPricingModalProps> = ({ onClose, onSave, currentPlans }) => {
  const [plans, setPlans] = useState<PlanPricing[]>(currentPlans);
  const [loading, setLoading] = useState(false);

  const handlePlanChange = (index: number, field: keyof PlanPricing, value: string | number) => {
    const updatedPlans = [...plans];
    updatedPlans[index] = {
      ...updatedPlans[index],
      [field]: field === 'price' ? parseFloat(value.toString()) || 0 : value
    };
    setPlans(updatedPlans);
  };

  const addPlan = () => {
    setPlans([...plans, { name: '', price: 0, description: '' }]);
  };

  const removePlan = (index: number) => {
    if (plans.length > 1) {
      setPlans(plans.filter((_, i) => i !== index));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      await onSave(plans);
      onClose();
    } catch (error) {
      console.error('Erro ao salvar planos:', error);
      alert('Erro ao salvar planos. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Package size={20} />
            Gerenciar Planos e Preços
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="space-y-6">
            {plans.map((plan, index) => (
              <div key={index} className="bg-gray-700/50 rounded-lg p-4 border border-gray-600">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-white">Plano {index + 1}</h3>
                  {plans.length > 1 && (
                    <button
                      type="button"
                      onClick={() => removePlan(index)}
                      className="px-3 py-1 bg-red-600 hover:bg-red-700 text-white text-sm rounded-lg transition-colors"
                    >
                      Remover
                    </button>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {/* Nome do Plano */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      Nome do Plano
                    </label>
                    <input
                      type="text"
                      value={plan.name}
                      onChange={(e) => handlePlanChange(index, 'name', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="Ex: Básico, Premium, Ultimate"
                      required
                    />
                  </div>

                  {/* Preço */}
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-2">
                      <DollarSign size={16} className="inline mr-1" />
                      Preço Mensal (R$)
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      value={plan.price}
                      onChange={(e) => handlePlanChange(index, 'price', e.target.value)}
                      className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500"
                      placeholder="0.00"
                      required
                    />
                  </div>
                </div>

                {/* Descrição */}
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-300 mb-2">
                    Descrição
                  </label>
                  <textarea
                    value={plan.description}
                    onChange={(e) => handlePlanChange(index, 'description', e.target.value)}
                    rows={2}
                    className="w-full px-3 py-2 bg-gray-700 border border-gray-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-green-500 resize-none"
                    placeholder="Descrição do plano (opcional)"
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Adicionar Plano */}
          <div className="mt-6">
            <button
              type="button"
              onClick={addPlan}
              className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Package size={18} />
              Adicionar Novo Plano
            </button>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-6 mt-6 border-t border-gray-700">
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
              {loading ? 'Salvando...' : 'Salvar Planos'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PlanPricingModal;