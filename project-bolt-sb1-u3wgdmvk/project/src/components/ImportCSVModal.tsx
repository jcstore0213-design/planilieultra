import React, { useState, useRef } from 'react';
import { X, Upload, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { UserType } from '../types';

interface ImportCSVModalProps {
  onImport: (csvData: string) => Promise<number>;
  onClose: () => void;
  userType: UserType;
}

const ImportCSVModal: React.FC<ImportCSVModalProps> = ({ onImport, onClose, userType }) => {
  const [file, setFile] = useState<File | null>(null);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    if (selectedFile) {
      if (selectedFile.name.endsWith('.csv')) {
        setFile(selectedFile);
        setMessage(null);
      } else {
        setMessage({ type: 'error', text: 'Por favor, selecione um arquivo CSV válido.' });
      }
    }
  };

  const handleImport = async () => {
    if (!file) return;

    setImporting(true);
    setMessage(null);

    try {
      const text = await file.text();
      const importedCount = await onImport(text);
      
      setMessage({ 
        type: 'success', 
        text: `${importedCount} clientes importados com sucesso!` 
      });
      
      setTimeout(() => {
        onClose();
      }, 2000);
    } catch (error) {
      setMessage({ 
        type: 'error', 
        text: 'Erro ao importar arquivo. Verifique o formato.' 
      });
    } finally {
      setImporting(false);
    }
  };

  const downloadTemplate = () => {
    const template = 'Nome,Telefone,Plano,MAC,Ativação,Vencimento,Status,Créditos\n' +
                    'João Silva,(11) 99999-9999,Básico,00:00:00:00:00:01,2024-01-01,2024-02-01,ativo,30\n' +
                    'Maria Santos,(11) 88888-8888,Premium,00:00:00:00:00:02,2024-01-01,2024-02-01,ativo,50';
    
    const blob = new Blob([template], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'template_clientes.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-gray-800 rounded-xl shadow-2xl w-full max-w-md">
        <div className="flex items-center justify-between p-6 border-b border-gray-700">
          <h2 className="text-xl font-semibold text-white flex items-center gap-2">
            <Upload size={20} />
            Importar Clientes - {userType.toUpperCase()}
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-white hover:bg-gray-700 rounded-lg transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {/* Template Download */}
          <div className="bg-blue-500/10 border border-blue-500/30 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <FileText size={16} className="text-blue-400" />
              <span className="text-blue-400 font-medium">Template CSV</span>
            </div>
            <p className="text-gray-300 text-sm mb-3">
              Baixe o template para ver o formato correto do arquivo CSV.
            </p>
            <button
              onClick={downloadTemplate}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg transition-colors"
            >
              Baixar Template
            </button>
          </div>

          {/* File Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Selecionar Arquivo CSV
            </label>
            <div className="border-2 border-dashed border-gray-600 rounded-lg p-6 text-center">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileSelect}
                className="hidden"
              />
              
              {file ? (
                <div className="flex items-center justify-center gap-2 text-green-400">
                  <CheckCircle2 size={20} />
                  <span>{file.name}</span>
                </div>
              ) : (
                <div>
                  <Upload size={32} className="mx-auto text-gray-500 mb-2" />
                  <p className="text-gray-400 mb-2">Clique para selecionar arquivo</p>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  >
                    Escolher Arquivo
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Message */}
          {message && (
            <div className={`p-3 rounded-lg ${
              message.type === 'success' 
                ? 'bg-green-500/20 border border-green-500/50' 
                : 'bg-red-500/20 border border-red-500/50'
            }`}>
              <div className="flex items-center gap-2">
                {message.type === 'success' ? (
                  <CheckCircle2 size={16} className="text-green-400" />
                ) : (
                  <AlertCircle size={16} className="text-red-400" />
                )}
                <span className={message.type === 'success' ? 'text-green-400' : 'text-red-400'}>
                  {message.text}
                </span>
              </div>
            </div>
          )}

          {/* Format Info */}
          <div className="bg-gray-700/50 rounded-lg p-4">
            <h4 className="text-sm font-medium text-gray-300 mb-2">Formato do CSV:</h4>
            <ul className="text-xs text-gray-400 space-y-1">
              <li>• Nome, Telefone, Plano, MAC, Ativação, Vencimento, Status, Créditos</li>
              <li>• Planos: Básico, Premium, Ultimate</li>
              <li>• Status: ativo, inativo, suspenso</li>
              <li>• Datas no formato: YYYY-MM-DD</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3 pt-4">
            <button
              onClick={onClose}
              disabled={importing}
              className="flex-1 px-4 py-2 bg-gray-700 hover:bg-gray-600 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              Cancelar
            </button>
            <button
              onClick={handleImport}
              disabled={!file || importing}
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg transition-colors"
            >
              {importing ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Upload size={18} />
              )}
              {importing ? 'Importando...' : 'Importar'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImportCSVModal;