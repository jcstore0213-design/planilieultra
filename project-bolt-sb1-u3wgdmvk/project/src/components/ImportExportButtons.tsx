import React, { useRef, useState } from 'react';
import { Upload, Download, FileText, AlertCircle, CheckCircle2 } from 'lucide-react';
import { Client, UserType } from '../types';

interface ImportExportButtonsProps {
  clients: Client[];
  userType: UserType;
  onImport: (csvData: string) => Promise<number>;
}

const ImportExportButtons: React.FC<ImportExportButtonsProps> = ({ 
  clients, 
  userType, 
  onImport 
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importing, setImporting] = useState(false);
  const [importMessage, setImportMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const handleImportClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith('.csv')) {
      setImportMessage({ type: 'error', text: 'Por favor, selecione um arquivo CSV válido.' });
      return;
    }

    setImporting(true);
    setImportMessage(null);

    try {
      const text = await file.text();
      const importedCount = await onImport(text);
      
      setImportMessage({ 
        type: 'success', 
        text: `${importedCount} clientes importados com sucesso!` 
      });
    } catch (error) {
      setImportMessage({ 
        type: 'error', 
        text: 'Erro ao importar arquivo. Verifique o formato.' 
      });
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const exportToCSV = () => {
    const headers = ['Nome', 'Telefone', 'Plano', 'MAC', 'Ativação', 'Vencimento', 'Status', 'Créditos', 'Notas'];
    const csvContent = [
      headers.join(','),
      ...clients.map(client => [
        `"${client.name}"`,
        `"${client.phone}"`,
        `"${client.plan}"`,
        `"${client.mac}"`,
        client.activation,
        client.expiry,
        client.status,
        client.credits.toString(),
        `"${client.notes || ''}"`
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `clientes_${userType}_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportToPDF = () => {
    // Criar conteúdo HTML para PDF
    const htmlContent = `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Relatório de Clientes - ${userType.toUpperCase()}</title>
        <style>
          body { font-family: Arial, sans-serif; margin: 20px; }
          h1 { color: #16a34a; text-align: center; }
          table { width: 100%; border-collapse: collapse; margin-top: 20px; }
          th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
          th { background-color: #f2f2f2; }
          .status-ativo { color: #16a34a; font-weight: bold; }
          .status-inativo { color: #dc2626; font-weight: bold; }
          .status-suspenso { color: #eab308; font-weight: bold; }
        </style>
      </head>
      <body>
        <h1>Relatório de Clientes - ${userType.toUpperCase()}</h1>
        <p>Data: ${new Date().toLocaleDateString('pt-BR')}</p>
        <p>Total de clientes: ${clients.length}</p>
        
        <table>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Telefone</th>
              <th>Plano</th>
              <th>Status</th>
              <th>Vencimento</th>
              <th>Créditos</th>
            </tr>
          </thead>
          <tbody>
            ${clients.map(client => `
              <tr>
                <td>${client.name}</td>
                <td>${client.phone}</td>
                <td>${client.plan}</td>
                <td class="status-${client.status}">${client.status.toUpperCase()}</td>
                <td>${new Date(client.expiry).toLocaleDateString('pt-BR')}</td>
                <td>R$ ${client.credits.toFixed(2)}</td>
              </tr>
            `).join('')}
          </tbody>
        </table>
      </body>
      </html>
    `;

    const blob = new Blob([htmlContent], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio_clientes_${userType}_${new Date().toISOString().split('T')[0]}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-col sm:flex-row gap-2">
      {/* Botão de Importar */}
      <button
        onClick={handleImportClick}
        disabled={importing}
        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg transition-colors"
      >
        <Upload size={16} />
        {importing ? 'Importando...' : 'Importar CSV'}
      </button>

      {/* Input de arquivo oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Botão de Exportar CSV */}
      <button
        onClick={exportToCSV}
        className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
      >
        <Download size={16} />
        Exportar CSV
      </button>

      {/* Botão de Exportar PDF */}
      <button
        onClick={exportToPDF}
        className="flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
      >
        <FileText size={16} />
        Exportar PDF
      </button>

      {/* Mensagem de importação */}
      {importMessage && (
        <div className={`fixed top-4 right-4 p-4 rounded-lg shadow-lg z-50 ${
          importMessage.type === 'success' 
            ? 'bg-green-600 text-white' 
            : 'bg-red-600 text-white'
        }`}>
          <div className="flex items-center gap-2">
            {importMessage.type === 'success' ? (
              <CheckCircle2 size={20} />
            ) : (
              <AlertCircle size={20} />
            )}
            <span>{importMessage.text}</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default ImportExportButtons;