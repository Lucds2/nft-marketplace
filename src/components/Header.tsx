import { Link, useLocation } from '@tanstack/react-router';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useWeb3 } from '../context/Web3Context';
import { AuthModal } from './AuthModal';
import { ConnectWalletModal } from './ConnectWalletModal';

export function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const { status, wallet, disconnectWallet } = useWeb3();

  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);

  const location = useLocation();
  const isHome = location.pathname === '/';
  const isMarketplace =
    location.pathname.startsWith('/nft') || location.pathname === '/marketplace';

  const isWalletConnected = status === 'connected';

  return (
    <header className="w-full bg-[#0D0B0A] border-b border-zinc-800/80 px-6 py-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* LOGO */}
        <div className="flex items-center gap-2">
          <Link to="/" className="text-2xl font-black tracking-wider text-white">
            KURIO
          </Link>
        </div>

        {/* NAVEGAÇÃO PRINCIPAL */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          <Link
            to="/"
            className={`transition-colors ${
              isHome ? 'text-[#E08A3C]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Início
          </Link>
          <Link
            to="/"
            className={`transition-colors ${
              isMarketplace ? 'text-[#E08A3C]' : 'text-zinc-400 hover:text-white'
            }`}
          >
            Mercado
          </Link>
          <Link
            to="/"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Criadores
          </Link>
          <Link
            to="/"
            className="text-zinc-400 hover:text-white transition-colors"
          >
            Aprenda
          </Link>
        </nav>

        {/* ÁREA DE AUTENTICAÇÃO E CARTEIRA */}
        <div className="flex items-center gap-4">
          {/* BOTÃO CONECTAR CARTEIRA */}
          <button
            onClick={() =>
              isWalletConnected ? disconnectWallet() : setIsWalletModalOpen(true)
            }
            className="text-xs font-semibold px-3 py-2 rounded-lg border border-zinc-800 text-zinc-300 hover:border-zinc-700 transition-colors"
          >
            {isWalletConnected && wallet
              ? `${wallet.address.slice(0, 6)}...${wallet.address.slice(-4)}`
              : 'Conectar Carteira'}
          </button>

          {/* PERFIL / LOGIN */}
          {isAuthenticated && user ? (
            <div className="flex items-center gap-3">
              <Link
                to="/profile"
                className="flex items-center gap-2 hover:opacity-80 transition-opacity cursor-pointer"
              >
                <img
                  src={user.avatar || 'https://via.placeholder.com/40'}
                  alt={user.name || 'Utilizador'}
                  className="w-9 h-9 rounded-full border border-[#E08A3C] object-cover"
                />
                <span className="text-sm font-medium text-white hidden sm:inline">
                  {user.name}
                </span>
              </Link>

              <button
                onClick={logout}
                className="text-xs text-zinc-400 hover:text-red-400 border border-zinc-800 px-3 py-1.5 rounded-lg transition-colors"
              >
                Sair
              </button>
            </div>
          ) : (
            <button
              onClick={() => setIsAuthModalOpen(true)}
              className="flex items-center gap-2 bg-[#E08A3C] hover:bg-[#c9782f] text-black font-semibold text-sm px-4 py-2 rounded-lg transition-colors"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                <polyline points="10 17 15 12 10 7" />
                <line x1="15" y1="12" x2="3" y2="12" />
              </svg>
              <span>Entrar</span>
            </button>
          )}
        </div>
      </div>

      {/* MODAIS */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
      />
      {isWalletModalOpen && (
        <ConnectWalletModal
          isOpen={isWalletModalOpen}
          onClose={() => setIsWalletModalOpen(false)}
        />
      )}
    </header>
  );
}