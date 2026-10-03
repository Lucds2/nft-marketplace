/* eslint-disable react-refresh/only-export-components */

import React, { createContext, useContext, useState } from 'react';

export type Web3Status = 'disconnected' | 'connecting' | 'connected' | 'rejected';

export interface WalletInfo {
  address: string;
  network: string;
  provider: string;
  balanceEth: string;
}

interface Web3ContextType {
  status: Web3Status;
  wallet: WalletInfo | null;
  errorMessage: string | null;
  connectWallet: (providerName?: string) => Promise<boolean>;
  disconnectWallet: () => void;
  resetStatus: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

const MOCK_WALLETS: Record<string, WalletInfo> = {
  MetaMask: {
    address: '0x71C...39E8',
    network: 'Ethereum Mainnet',
    provider: 'MetaMask',
    balanceEth: '12.45',
  },
  'Coinbase Wallet': {
    address: '0x3A2...91B4',
    network: 'Ethereum Mainnet',
    provider: 'Coinbase Wallet',
    balanceEth: '3.10',
  },
};

export const Web3Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Inicialização síncrona/preguiçosa do estado a partir do localStorage
  const [wallet, setWallet] = useState<WalletInfo | null>(() => {
    const savedWallet = localStorage.getItem('@kurio:web3_wallet');
    if (savedWallet) {
      try {
        return JSON.parse(savedWallet);
      } catch {
        localStorage.removeItem('@kurio:web3_wallet');
      }
    }
    return null;
  });

  const [status, setStatus] = useState<Web3Status>(() => (wallet ? 'connected' : 'disconnected'));
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const connectWallet = async (providerName: string = 'MetaMask'): Promise<boolean> => {
    setStatus('connecting');
    setErrorMessage(null);

    return new Promise((resolve) => {
      setTimeout(() => {
        const simulateUserRejection = false; // Mude para true se quiser simular recusa nos testes

        if (simulateUserRejection) {
          setStatus('rejected');
          setErrorMessage('Usuário recusou a conexão com a carteira.');
          setWallet(null);
          resolve(false);
        } else {
          const selectedWallet = MOCK_WALLETS[providerName] || {
            address: '0x71C...39E8',
            network: 'Ethereum Mainnet',
            provider: providerName,
            balanceEth: '12.45',
          };

          setWallet(selectedWallet);
          setStatus('connected');
          localStorage.setItem('@kurio:web3_wallet', JSON.stringify(selectedWallet));
          resolve(true);
        }
      }, 1500);
    });
  };

  const disconnectWallet = () => {
    setWallet(null);
    setStatus('disconnected');
    setErrorMessage(null);
    localStorage.removeItem('@kurio:web3_wallet');
  };

  const resetStatus = () => {
    setStatus('disconnected');
    setErrorMessage(null);
  };

  return (
    <Web3Context.Provider
      value={{
        status,
        wallet,
        errorMessage,
        connectWallet,
        disconnectWallet,
        resetStatus,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
};

// Hook exportado no mesmo arquivo
export function useWeb3() {
  const context = useContext(Web3Context);
  if (!context) {
    throw new Error('useWeb3 deve ser usado dentro de um Web3Provider');
  }
  return context;
}