import { useState } from 'react';
import { useWeb3 } from '../context/Web3Context';

interface Props {
  isOpen: boolean;
  onClose: () => void;
}

export function ConnectWalletModal({ isOpen, onClose }: Props) {
  const { status, connectWallet, errorMessage, resetStatus } = useWeb3();
  const [selectedProvider, setSelectedProvider] = useState('MetaMask');

  if (!isOpen) return null;

  const handleConnect = async () => {
    const success = await connectWallet(selectedProvider);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
      <div className="bg-[#1F140E] border border-[#2A1C16] rounded-2xl max-w-md w-full p-6 relative text-white">
        <button
          onClick={() => {
            resetStatus();
            onClose();
          }}
          className="absolute top-4 right-4 text-zinc-400 hover:text-white"
        >
          ✕
        </button>

        <h2 className="text-xl font-bold mb-2">Conectar Carteira Web3</h2>
        <p className="text-sm text-zinc-400 mb-6">
          Selecione o provedor de carteira para continuar no marketplace.
        </p>

        {status === 'connecting' && (
          <div className="py-8 text-center space-y-4">
            <div className="w-10 h-10 border-4 border-[#E08A3C] border-t-transparent rounded-full animate-spin mx-auto" />
            <p className="text-sm font-mono text-[#E08A3C]">
              Solicitando conexão com {selectedProvider}...
            </p>
            <p className="text-xs text-zinc-500">
              Aprove a assinatura na janela da sua carteira.
            </p>
          </div>
        )}

        {status === 'rejected' && (
          <div className="bg-red-500/10 border border-red-500/30 p-4 rounded-xl mb-6">
            <p className="text-xs text-red-400 font-medium mb-1">
              Conexão Recusada
            </p>
            <p className="text-xs text-zinc-300">
              {errorMessage || 'A solicitação foi cancelada pelo usuário.'}
            </p>
          </div>
        )}

        {status !== 'connecting' && (
          <>
            <div className="space-y-3 mb-6">
              {['MetaMask', 'Coinbase Wallet'].map((provider) => (
                <button
                  key={provider}
                  type="button"
                  onClick={() => setSelectedProvider(provider)}
                  className={`w-full p-4 rounded-xl border flex items-center justify-between transition ${
                    selectedProvider === provider
                      ? 'border-[#E08A3C] bg-[#E08A3C]/10 text-white'
                      : 'border-[#2A1C16] bg-[#140D09] text-zinc-400 hover:border-zinc-700'
                  }`}
                >
                  <span className="font-medium text-sm">{provider}</span>
                  {selectedProvider === provider && (
                    <span className="w-2 h-2 rounded-full bg-[#E08A3C]" />
                  )}
                </button>
              ))}
            </div>

            <div className="flex gap-3">
              <button
                type="button"
                onClick={handleConnect}
                className="w-full bg-[#E08A3C] hover:bg-[#d0792c] text-black font-bold py-3 rounded-xl transition"
              >
                Conectar
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}