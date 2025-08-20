import React from 'react';
import { BarChart3, PieChart, TrendingUp } from 'lucide-react';
import { Client } from '../types';

interface ClientChartProps {
  clients: Client[];
}

const ClientChart: React.FC<ClientChartProps> = ({ clients }) => {
  const getStatusStats = () => {
    const stats = clients.reduce((acc, client) => {
      acc[client.status] = (acc[client.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    return [
      { status: 'ativo', count: stats.ativo || 0, color: 'bg-green-500' },
      { status: 'inativo', count: stats.inativo || 0, color: 'bg-red-500' },
      { status: 'suspenso', count: stats.suspenso || 0, color: 'bg-yellow-500' }
    ];
  };

  const getPlanStats = () => {
    const stats = clients.reduce((acc, client) => {
      if (client.status === 'ativo') {
        acc[client.plan] = (acc[client.plan] || 0) + 1;
      }
      return acc;
    }, {} as Record<string, number>);

    return [
      { plan: 'Básico', count: stats.Básico || 0, revenue: (stats.Básico || 0) * 30 },
      { plan: 'Premium', count: stats.Premium || 0, revenue: (stats.Premium || 0) * 50 },
      { plan: 'Ultimate', count: stats.Ultimate || 0, revenue: (stats.Ultimate || 0) * 70 }
    ];
  };

  const statusStats = getStatusStats();
  const planStats = getPlanStats();
  const totalClients = clients.length;
  const maxCount = Math.max(...statusStats.map(s => s.count), 1);

  return (
    <div className="bg-gray-800 p-6 rounded-lg border border-gray-700">
      <h3 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <BarChart3 size={20} />
        Estatísticas de Clientes
      </h3>

      {/* Status Distribution */}
      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-400 mb-3">Distribuição por Status</h4>
        <div className="space-y-3">
          {statusStats.map(({ status, count, color }) => (
            <div key={status} className="flex items-center gap-3">
              <div className="flex items-center gap-2 w-20">
                <div className={`w-3 h-3 rounded-full ${color}`}></div>
                <span className="text-sm text-gray-300 capitalize">{status}</span>
              </div>
              <div className="flex-1 flex items-center gap-2">
                <div className="flex-1 bg-gray-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full ${color}`}
                    style={{ width: `${(count / maxCount) * 100}%` }}
                  ></div>
                </div>
                <span className="text-sm text-white font-medium w-8 text-right">{count}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Plan Revenue */}
      <div>
        <h4 className="text-sm font-medium text-gray-400 mb-3">Receita por Plano</h4>
        <div className="space-y-2">
          {planStats.map(({ plan, count, revenue }) => (
            <div key={plan} className="flex items-center justify-between p-2 bg-gray-700/50 rounded">
              <div>
                <span className="text-sm text-white">{plan}</span>
                <span className="text-xs text-gray-400 ml-2">({count} clientes)</span>
              </div>
              <span className="text-sm text-green-400 font-medium">R$ {revenue.toFixed(2)}</span>
            </div>
          ))}
        </div>
        
        <div className="mt-4 pt-4 border-t border-gray-700">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-300">Receita Total:</span>
            <span className="text-lg font-bold text-green-400">
              R$ {planStats.reduce((sum, p) => sum + p.revenue, 0).toFixed(2)}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ClientChart;