import React, { useState } from 'react';
import { Shield, Tv, Lock } from 'lucide-react';
import Dashboard from './components/Dashboard';
import { UserType } from './types';

function App() {
  const [user, setUser] = useState<{ type: UserType; isAuthenticated: boolean } | null>(null);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (password === '3str4NH$') {
      setUser({ type: 'dono', isAuthenticated: true });
    } else if (password === '3str4NH@') {
      setUser({ type: 'socio', isAuthenticated: true });
    } else {
      setError('Senha incorreta. Tente novamente.');
      setPassword('');
    }
  };

  const handleLogout = () => {
    setUser(null);
    setPassword('');
    setError('');
  };

  if (user?.isAuthenticated) {
    return <Dashboard userType={user.type} onLogout={handleLogout} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Logo/Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-600 rounded-full mb-4">
            <Tv className="text-white" size={32} />
          </div>
          <h1 className="text-3xl font-bold text-white mb-2">IPTV Manager</h1>
          <p className="text-gray-400">Sistema de Gestão Profissional</p>
        </div>

        {/* Login Form */}
        <div className="bg-gray-800 rounded-xl shadow-2xl p-8 border border-gray-700">
          <div className="flex items-center justify-center mb-6">
            <Shield className="text-green-400 mr-2" size={24} />
            <h2 className="text-xl font-semibold text-white">Acesso Restrito</h2>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Senha de Acesso
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-gray-700 border border-gray-600 rounded-lg text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="Digite sua senha"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="p-3 bg-red-500/20 border border-red-500/50 rounded-lg">
                <p className="text-red-400 text-sm text-center">{error}</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800"
            >
              Entrar no Sistema
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-700">
            <div className="text-xs text-gray-500 space-y-1">
              <p className="flex items-center justify-between">
                <span></span>
                <span className="font-mono"></span>
              </p>
              <p className="flex items-center justify-between">
                <span></span>
                <span className="font-mono"></span>
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-gray-500 text-sm">
            © 2024 IPTV Manager - Sistema Profissional
          </p>
        </div>
      </div>
    </div>
  );
}

export default App;