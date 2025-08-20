import React, { useState } from 'react';
import { 
  Phone, 
  Calendar, 
  Wifi, 
  DollarSign, 
  Edit2, 
  Trash2, 
  MessageCircle, 
  Eye, 
  EyeOff,
  AlertCircle,
  CheckCircle2,
  Clock,
  RotateCcw
} from 'lucide-react';
import { Client } from '../types';
import EditClientModal from './EditClientModal';

interface ClientCardProps {
  client: Client;
  onEdit: (client: Client) => void;
  onDelete: (id: string) => void;
  onToggleStatus: (id: string) => void;
  onRenewClient: (id: string) => void;
  onUpdateCredits: (id: string, credits: number) => void;
}

const ClientCard: React.FC<ClientCardProps> = ({ 
  client, 
  onEdit, 
  onDelete, 
  onToggleStatus,
  onRenewClient,
  onUpdateCredits
}) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [loading, setLoading] = useState(false);

  const getDaysUntilExpiry = () => {
    const today = new Date();
    const expiryDate = new Date(client.expiry);
    const diffTime = expiryDate.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const daysUntilExpiry = getDaysUntilExpiry();
  const isExpiring = daysUntilExpiry <= 7 && daysUntilExpiry > 0;
  const isExpired = daysUntilExpiry < 0;

  const getStatusColor = () => {
    switch (client.status) {
      case 'ativo': return 'text-green-400 bg-green-400/20';
      case 'inativo': return 'text-red-400 bg-red-400/20';
      case 'suspenso': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = () => {
    switch (client.status) {
      case 'ativo': return <CheckCircle2 size={16} />;
      case 'inativo': return <AlertCircle size={16} />;
      case 'suspenso': return <Clock size={16} />;
      default: return <AlertCircle size={16} />;
    }
  };

  const handleWhatsApp = () => {
    const message = `Olá ${client.name}! Seu plano IPTV vence em ${daysUntilExpiry} dias. Renove já!`;
    const url = `https://wa.me/55${client.phone.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleEditSubmit = async (updatedClient: Client) => {
    setLoading(true);
    try {
      await onEdit(updatedClient);
    } catch (error) {
      console.error('Erro ao editar cliente:', error);
    } finally {
      setLoading(false);
    }
    setShowEditModal(false);
  };

  const handleToggleStatus = async () => {
    setLoading(true);
    try {
      await onToggleStatus(client.id);
    } catch (error) {
      console.error('Erro ao alterar status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRenewClient = async () => {
    setLoading(true);
    try {
      await onRenewClient(client.id);
    } catch (error) {
      console.error('Erro ao renovar cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      await onDelete(client.id);
    } catch (error) {
      console.error('Erro ao excluir cliente:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className={`bg-gray-800 rounded-lg p-6 border transition-all duration-300 hover:shadow-lg relative ${
        isExpired ? 'border-red-500/50 shadow-red-500/20' : 
        isExpiring ? 'border-yellow-500/50 shadow-yellow-500/20' : 
        'border-gray-700 hover:border-gray-600'
      }`}>
        {/* Loading Overlay */}
        {loading && (
          <div className="absolute inset-0 bg-gray-900/50 rounded-lg flex items-center justify-center z-10">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
          </div>
        )}

        {/* Header com Status */}
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-1">{client.name}</h3>
            <div className={`inline-flex items-center gap-2 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor()}`}>
              {getStatusIcon()}
              {client.status.toUpperCase()}
            </div>
          </div>
          <div className="flex gap-1">
            <button
              onClick={() => setShowEditModal(true)}
              disabled={loading}
              className="p-2 text-blue-400 hover:text-blue-300 hover:bg-blue-400/10 rounded-lg transition-colors"
              title="Editar cliente"
            >
              <Edit2 size={16} />
            </button>
            <button
              onClick={handleToggleStatus}
              disabled={loading}
              className="p-2 text-yellow-400 hover:text-yellow-300 hover:bg-yellow-400/10 rounded-lg transition-colors"
              title="Alternar status"
            >
              <RotateCcw size={16} />
            </button>
            <button
              onClick={handleRenewClient}
              disabled={loading}
              className="p-2 text-green-400 hover:text-green-300 hover:bg-green-400/10 rounded-lg transition-colors"
              title="Renovar cliente"
            >
              <CheckCircle2 size={16} />
            </button>
            <button
              onClick={handleDelete}
              disabled={loading}
              className="p-2 text-red-400 hover:text-red-300 hover:bg-red-400/10 rounded-lg transition-colors"
              title="Excluir cliente"
            >
              <Trash2 size={16} />
            </button>
          </div>
        </div>

        {/* Alertas de Vencimento */}
        {isExpired && (
          <div className="mb-3 p-2 bg-red-500/20 border border-red-500/50 rounded-lg">
            <div className="flex items-center gap-2 text-red-400 text-sm">
              <AlertCircle size={16} />
              <span className="font-medium">Expirado há {Math.abs(daysUntilExpiry)} dias!</span>
            </div>
          </div>
        )}

        {isExpiring && (
          <div className="mb-3 p-2 bg-yellow-500/20 border border-yellow-500/50 rounded-lg">
            <div className="flex items-center gap-2 text-yellow-400 text-sm">
              <Clock size={16} />
              <span className="font-medium">Vence em {daysUntilExpiry} dias!</span>
            </div>
          </div>
        )}

        {/* Informações do Cliente */}
        <div className="space-y-2 mb-4">
          <div className="flex items-center gap-2 text-gray-300">
            <Phone size={16} className="text-gray-500" />
            <span className="text-sm">{client.phone}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <Wifi size={16} className="text-gray-500" />
            <span className="text-sm">Plano: {client.plan}</span>
          </div>
          
          {client.mac && (
            <div className="flex items-center gap-2 text-gray-300">
              <span className="text-gray-500 text-sm">MAC:</span>
              <span className="text-sm font-mono">{client.mac}</span>
            </div>
          )}
          
          <div className="flex items-center gap-2 text-gray-300">
            <Calendar size={16} className="text-gray-500" />
            <span className="text-sm">Vence: {new Date(client.expiry).toLocaleDateString('pt-BR')}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-300">
            <DollarSign size={16} className="text-gray-500" />
            <span className="text-sm">Créditos: R$ {client.credits.toFixed(2)}</span>
          </div>
        </div>

        {/* Notas Internas */}
        {client.notes && (
          <div className="mb-4">
            <button
              onClick={() => setShowNotes(!showNotes)}
              className="flex items-center gap-2 text-sm text-gray-400 hover:text-gray-300 transition-colors"
            >
              {showNotes ? <EyeOff size={14} /> : <Eye size={14} />}
              {showNotes ? 'Ocultar notas' : 'Ver notas internas'}
            </button>
            {showNotes && (
              <div className="mt-2 p-2 bg-gray-700/50 rounded text-sm text-gray-300 border-l-2 border-blue-500">
                {client.notes}
              </div>
            )}
          </div>
        )}

        {/* Ações */}
        <div className="flex gap-2">
          <button
            onClick={handleWhatsApp}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white text-sm rounded-lg transition-colors"
          >
            <MessageCircle size={16} />
            WhatsApp
          </button>
          
          <button
            onClick={() => {
              const pixMessage = `Pague seu plano IPTV: PIX: iptv@exemplo.com - Valor: R$ ${client.plan.includes('Premium') ? '50,00' : '30,00'}`;
              navigator.clipboard.writeText(pixMessage);
              alert('Link de pagamento copiado!');
            }}
            disabled={loading}
            className="flex-1 flex items-center justify-center gap-2 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
          >
            <DollarSign size={16} />
            Cobrar
          </button>
        </div>
      </div>

      {/* Modal de Edição */}
      {showEditModal && (
        <EditClientModal
          client={client}
          onSubmit={handleEditSubmit}
          onClose={() => setShowEditModal(false)}
        />
      )}
    </>
  );
};

export default ClientCard;