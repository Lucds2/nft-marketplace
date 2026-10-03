/* eslint-disable react-refresh/only-export-components */

import React, { useState } from 'react';
import { createRoute } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface Wallet {
  id: string;
  address: string;
  network: string;
  isPrimary?: boolean;
}

function WalletsPage() {
  const { user } = useAuth();
  const [address, setAddress] = useState('');
  const [network, setNetwork] = useState('Ethereum');
  const [isPrimary, setIsPrimary] = useState(false);
  const [loading, setLoading] = useState(false);

  // Estados para edição
  const [editingWalletId, setEditingWalletId] = useState<string | null>(null);
  const [editAddress, setEditAddress] = useState('');
  const [editNetwork, setEditNetwork] = useState('Ethereum');

  const handleAddWallet = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    try {
      await api.post('/users/wallets', { address, network, isPrimary });
      setAddress('');
      window.location.reload();
    } catch {
      alert('Erro ao guardar carteira.');
    } finally {
      setLoading(false);
    }
  };

  const handleStartEdit = (wallet: Wallet) => {
    setEditingWalletId(wallet.id);
    setEditAddress(wallet.address);
    setEditNetwork(wallet.network);
  };

  const handleSaveEdit = async (walletId: string) => {
    try {
      await api.put(`/users/wallets/${walletId}`, {
        address: editAddress,
        network: editNetwork,
      });
      setEditingWalletId(null);
      window.location.reload();
    } catch {
      alert('Erro ao atualizar carteira.');
    }
  };

  const handleSetPrimary = async (walletId: string) => {
    try {
      await api.put(`/users/wallets/${walletId}`, { isPrimary: true });
      window.location.reload();
    } catch {
      alert('Erro ao definir carteira principal.');
    }
  };

  const handleDeleteWallet = async (walletId: string) => {
    if (!confirm('Deseja realmente remover esta carteira?')) return;

    try {
      await api.delete(`/users/wallets/${walletId}`);
      window.location.reload();
    } catch {
      alert('Erro ao remover carteira.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-10 text-white">
      <h1 className="text-3xl font-bold mb-2">Minhas Carteiras Web3</h1>
      <p className="text-zinc-400 mb-8">Gerencie os seus endereços conectados para compra e liquidação de NFTs.</p>

      {/* Lista de Carteiras Cadastradas */}
      <div className="space-y-4 mb-10">
        <h2 className="text-lg font-semibold text-zinc-300">Carteiras Cadastradas</h2>
        {!user?.wallets || user.wallets.length === 0 ? (
          <p className="text-sm text-zinc-500 italic">Nenhuma carteira cadastrada até ao momento.</p>
        ) : (
          user.wallets.map((wallet) => (
            <div
              key={wallet.id}
              className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-zinc-900 border border-zinc-800 rounded-xl gap-4"
            >
              {editingWalletId === wallet.id ? (
                <div className="flex-1 space-y-2">
                  <input
                    type="text"
                    value={editAddress}
                    onChange={(e) => setEditAddress(e.target.value)}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-sm text-white"
                  />
                  <select
                    value={editNetwork}
                    onChange={(e) => setEditNetwork(e.target.value)}
                    className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-3 py-1.5 text-sm text-white"
                  >
                    <option value="Ethereum">Ethereum (Mainnet)</option>
                    <option value="Polygon">Polygon (MATIC)</option>
                    <option value="Solana">Solana</option>
                  </select>
                  <div className="flex gap-2 pt-1">
                    <button
                      onClick={() => handleSaveEdit(wallet.id)}
                      className="bg-[#E08A3C] text-black text-xs font-semibold px-3 py-1.5 rounded-lg"
                    >
                      Salvar
                    </button>
                    <button
                      onClick={() => setEditingWalletId(null)}
                      className="bg-zinc-800 text-zinc-400 text-xs px-3 py-1.5 rounded-lg"
                    >
                      Cancelar
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <div>
                    <span className="font-mono text-sm text-white">{wallet.address}</span>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-zinc-400">{wallet.network}</span>
                      {wallet.isPrimary && (
                        <span className="bg-[#E08A3C]/20 text-[#E08A3C] text-[10px] font-bold px-2 py-0.5 rounded-md">
                          Principal
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    {!wallet.isPrimary && (
                      <button
                        onClick={() => handleSetPrimary(wallet.id)}
                        className="text-xs text-zinc-400 hover:text-[#E08A3C] transition"
                      >
                        Tornar Principal
                      </button>
                    )}
                    <button
                      onClick={() => handleStartEdit(wallet)}
                      className="text-xs text-zinc-300 hover:text-white bg-zinc-800 px-2.5 py-1 rounded-md"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() => handleDeleteWallet(wallet.id)}
                      className="text-xs text-red-400 hover:text-red-300 bg-red-500/10 border border-red-500/20 px-2.5 py-1 rounded-md"
                    >
                      Remover
                    </button>
                  </div>
                </>
              )}
            </div>
          ))
        )}
      </div>

      {/* Formulário de Adicionar Carteira */}
      <form onSubmit={handleAddWallet} className="bg-zinc-900/60 p-6 rounded-2xl border border-zinc-800 space-y-4">
        <h2 className="text-lg font-semibold text-zinc-200">Adicionar Nova Carteira</h2>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Endereço Público (0x...)</label>
          <input
            type="text"
            required
            placeholder="0x71C...399"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E08A3C]"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-zinc-300 mb-1">Rede Blockchain</label>
          <select
            value={network}
            onChange={(e) => setNetwork(e.target.value)}
            className="w-full rounded-xl bg-zinc-800 border border-zinc-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-[#E08A3C]"
          >
            <option value="Ethereum">Ethereum (Mainnet)</option>
            <option value="Polygon">Polygon (MATIC)</option>
            <option value="Solana">Solana</option>
          </select>
        </div>

        <div className="flex items-center gap-2 pt-2">
          <input
            type="checkbox"
            id="isPrimary"
            checked={isPrimary}
            onChange={(e) => setIsPrimary(e.target.checked)}
            className="rounded bg-zinc-800 border-zinc-700 text-[#E08A3C] focus:ring-[#E08A3C]"
          />
          <label htmlFor="isPrimary" className="text-sm text-zinc-300">
            Definir como carteira principal
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="bg-[#E08A3C] hover:bg-[#c9782f] text-black font-semibold px-6 py-2.5 rounded-xl transition disabled:opacity-50"
        >
          {loading ? 'A guardar...' : 'Cadastrar Carteira'}
        </button>
      </form>
    </div>
  );
}

export const walletsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/wallets',
  component: WalletsPage,
});