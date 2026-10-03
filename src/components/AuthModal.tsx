import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { AxiosError } from 'axios';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const [isRegister, setIsRegister] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { login, register } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      if (isRegister) {
        await register({ name, email, password });
      } else {
        await login(email, password);
      }
      onClose();
    } catch (err: unknown) {
      if (err instanceof AxiosError && err.response?.data?.message) {
        setError(err.response.data.message);
      } else if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('Ocorreu um erro ao processar o seu pedido.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-md rounded-2xl bg-zinc-900 border border-zinc-800 p-6 shadow-xl text-white">
        {/* Botão Fechar */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-2">
          {isRegister ? 'Criar Conta' : 'Entrar na Conta'}
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          {isRegister
            ? 'Preencha os seus dados para criar um perfil.'
            : 'Utilize o seu e-mail e palavra-passe para aceder.'}
        </p>

        {error && (
          <div className="mb-4 rounded-lg bg-red-500/10 border border-red-500/30 p-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {isRegister && (
            <div>
              <label className="block text-sm font-medium text-zinc-300 mb-1">Nome</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="O seu nome"
                className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:border-purple-500"
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">E-mail</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="exemplo@email.com"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-300 mb-1">Palavra-passe</label>
            <input
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              className="w-full rounded-lg bg-zinc-800 border border-zinc-700 px-4 py-2 text-white focus:outline-none focus:border-purple-500"
            />
            {!isRegister && (
              <span className="text-xs text-zinc-500 mt-1 block">
                Dica de teste: Utilize a senha <code className="text-purple-400">123456</code>
              </span>
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-purple-600 hover:bg-purple-500 py-2.5 font-semibold text-white transition disabled:opacity-50"
          >
            {loading
              ? 'A carregar...'
              : isRegister
              ? 'Registar'
              : 'Entrar'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-zinc-400">
          {isRegister ? 'Já tem uma conta?' : 'Ainda não tem conta?'}{' '}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister);
              setError(null);
            }}
            className="text-purple-400 hover:underline font-medium"
          >
            {isRegister ? 'Fazer Login' : 'Registar-se'}
          </button>
        </div>
      </div>
    </div>
  );
};