/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

function ProfilePage() {
  const { user } = useAuth();
  const [name, setName] = useState(user?.name || '');
  const [avatar, setAvatar] = useState(user?.avatar || '');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      await api.put('/users/profile', {
        name,
        avatar,
        ...(password ? { password } : {}),
      });

      setMessage({ type: 'success', text: 'Perfil atualizado com sucesso!' });
      setPassword('');
    } catch {
      setMessage({ type: 'error', text: 'Erro ao atualizar o perfil. Tente novamente.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-2">Perfil do Colecionador</h1>
      <p className="text-zinc-400 mb-8">Gerencie as suas informações pessoais e credenciais de acesso.</p>

      {message && (
        <div
          className={`mb-6 p-4 rounded-xl text-sm ${
            message.type === 'success'
              ? 'bg-green-500/10 border border-green-500/30 text-green-400'
              : 'bg-red-500/10 border border-red-500/30 text-red-400'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6 bg-zinc-900/60 p-8 rounded-2xl border border-zinc-800">
        <div className="flex items-center gap-6 mb-4">
          <img
            src={avatar || 'https://via.placeholder.com/100'}
            alt="Avatar"
            className="w-20 h-20 rounded-full object-cover border-2 border-[#E08A3C]"
          />
          <div className="flex-1">
            <label className="block text-sm font-medium text-zinc-300 mb-1">URL do Avatar</label>
            <input
              type="url"
              value={avatar}
              onChange={(e) => setAvatar(e.target.value)}
              placeholder="https://exemplo.com/foto.jpg"
              className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E08A3C]"
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Nome Completo</label>
          <input
            type="text"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E08A3C]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">E-mail (Não editável)</label>
          <input
            type="email"
            disabled
            value={user?.email || ''}
            className="w-full rounded-xl bg-zinc-800/50 border border-zinc-800 px-4 py-2.5 text-sm text-zinc-500 cursor-not-allowed"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Nova Palavra-passe</label>
          <input
            type="password"
            placeholder="Deixe em branco para não alterar"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E08A3C]"
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#E08A3C] hover:bg-[#c9782f] text-black font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'A guardar...' : 'Guardar Alterações'}
        </button>
      </form>
    </div>
  );
}

export const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile',
  component: ProfilePage,
});