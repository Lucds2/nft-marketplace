/* eslint-disable react-refresh/only-export-components */
import { createRoute, Link, useNavigate } from '@tanstack/react-router';
import { useState } from 'react';
import { rootRoute } from './__root';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';

function CheckoutContent() {
  const { cart, clearCart } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    fullName: 'Luciano dos Santos',
    email: 'luciano@exemplo.com',
    walletAddress: '0x71C...39E8',
    network: 'ethereum-mainnet',
    walletProvider: 'metamask',
    notes: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const cartTotalNumber = cart.reduce((acc, item) => {
    const price = Number(item.nft.priceEth || item.nft.price || 0);
    return acc + price * item.quantity;
  }, 0);

  const networkFee = 0.016;
  const totalEth = (cartTotalNumber + networkFee).toFixed(3);

 const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    try {
      setIsSubmitting(true);
      setErrorMessage('');

      let orderData: Record<string, unknown> | null = null;

    try {
      const idempotencyKey = crypto.randomUUID();

      const response = await api.post(
        '/api/orders',
        {
          items: cart,
          total: totalEth,
          wallet: formData.walletAddress,
          network: formData.network,
          customer: {
            name: formData.fullName,
            email: formData.email,
          },
        },
        {
          headers: {
            'x-idempotency-key': idempotencyKey,
          },
        }
      );

      if (response?.data) {
        orderData = response.data;
      }
    } catch (apiErr) {
      console.warn('API/MSW indisponível. A gerar pedido localmente:', apiErr);
    }

      // Se a API não respondeu ou deu erro, usa os dados de fallback gerados no frontend
      if (!orderData) {
        orderData = {
          id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
          hash: `0x${Math.random().toString(16).substring(2, 18)}...`,
          items: cart,
          total: totalEth,
          customer: {
            name: formData.fullName,
            email: formData.email,
          },
        };
      }

      sessionStorage.setItem('lastOrder', JSON.stringify(orderData));
      clearCart();
      navigate({ to: '/order-confirmation' });
    } catch (err) {
      console.error('Erro crítico no checkout:', err);
      setErrorMessage('Falha ao processar a transação. Tente novamente.');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (cart.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#CFB28C]">
        <h2 className="text-2xl font-bold text-white mb-4">Seu carrinho está vazio</h2>
        <p className="mb-6 text-sm text-[#CFB28C]/80">
          Adicione alguns NFTs ao carrinho antes de prosseguir para o pagamento.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-[#E89B55] hover:bg-[#d88a44] text-[#120A06] font-bold text-sm rounded-xl transition-colors"
        >
          Explorar Mercado
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-8">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#CFB28C]/60 flex items-center gap-2">
        <Link to="/" className="hover:text-white transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link to="/cart" className="hover:text-white transition-colors">
          Carrinho
        </Link>
        <span>/</span>
        <span className="text-[#CFB28C]">Pagamento</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Formulário (7 colunas) */}
        <form onSubmit={handleSubmit} className="lg:col-span-7 space-y-6">
          <div className="bg-[#1B110B] border border-[#2A1C16] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b border-[#2A1C16] pb-3">
              Dados do Colecionador
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#CFB28C] mb-1 font-bold">
                  Nome Completo *
                </label>
                <input
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={(e) =>
                    setFormData({ ...formData, fullName: e.target.value })
                  }
                  className="w-full bg-[#120A06] border border-[#2A1C16] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#E89B55]"
                />
              </div>

              <div>
                <label className="block text-[#CFB28C] mb-1 font-bold">
                  E-mail de Notificação *
                </label>
                <input
                  type="email"
                  required
                  value={formData.email}
                  onChange={(e) =>
                    setFormData({ ...formData, email: e.target.value })
                  }
                  className="w-full bg-[#120A06] border border-[#2A1C16] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#E89B55]"
                />
              </div>
            </div>
          </div>

          {/* Seleção de Carteira */}
          <div className="bg-[#1B110B] border border-[#2A1C16] rounded-2xl p-6 space-y-4">
            <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b border-[#2A1C16] pb-3">
              Seleção de Carteira e Rede
            </h2>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-[#CFB28C] mb-1 font-bold">
                  Provedor de Carteira Web3
                </label>
                <select
                  value={formData.walletProvider}
                  onChange={(e) =>
                    setFormData({ ...formData, walletProvider: e.target.value })
                  }
                  className="w-full bg-[#120A06] border border-[#2A1C16] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#E89B55]"
                >
                  <option value="metamask">MetaMask (Conectado)</option>
                  <option value="coinbase">Coinbase Wallet</option>
                  <option value="walletconnect">WalletConnect</option>
                </select>
              </div>

              <div>
                <label className="block text-[#CFB28C] mb-1 font-bold">
                  Endereço da Carteira
                </label>
                <input
                  type="text"
                  readOnly
                  value={formData.walletAddress}
                  className="w-full bg-[#120A06]/50 border border-[#2A1C16] rounded-xl px-4 py-2.5 text-[#CFB28C]/60 font-mono cursor-not-allowed"
                />
              </div>

              <div>
                <label className="block text-[#CFB28C] mb-1 font-bold">
                  Rede Blockchain
                </label>
                <select
                  value={formData.network}
                  onChange={(e) =>
                    setFormData({ ...formData, network: e.target.value })
                  }
                  className="w-full bg-[#120A06] border border-[#2A1C16] rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-[#E89B55]"
                >
                  <option value="ethereum-mainnet">Ethereum Mainnet</option>
                  <option value="sepolia">Sepolia Testnet</option>
                  <option value="polygon">Polygon POS</option>
                </select>
              </div>
            </div>
          </div>

          {errorMessage && (
            <div className="p-3 bg-red-900/30 border border-red-700/50 rounded-xl text-red-200 text-xs">
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="w-full py-3.5 bg-[#E89B55] hover:bg-[#d88a44] text-[#120A06] font-bold text-sm rounded-xl transition-colors shadow-md disabled:opacity-50"
          >
            {isSubmitting ? 'PROCESSANDO TRANSAÇÃO...' : 'CONFIRMAR E ENVIAR PEDIDO'}
          </button>
        </form>

        {/* Resumo dos Itens (5 colunas) */}
        <div className="lg:col-span-5 bg-[#1B110B] border border-[#2A1C16] rounded-2xl p-6 space-y-6">
          <h2 className="text-lg font-bold text-white uppercase tracking-wider border-b border-[#2A1C16] pb-3">
            Resumo dos Itens
          </h2>

          <div className="space-y-4 max-h-80 overflow-y-auto pr-1">
            {cart.map((item) => {
              const name = item.nft.name || item.nft.title || 'NFT Asset';
              const unitPrice = Number(item.nft.priceEth || item.nft.price || 1.39);
              return (
                <div
                  key={item.nft.id}
                  className="flex items-center gap-3 border-b border-[#2A1C16]/50 pb-3"
                >
                  <img
                    src={item.nft.image}
                    alt={name}
                    className="w-12 h-12 rounded-lg object-cover bg-[#120A06]"
                  />
                  <div className="flex-1 min-w-0">
                    <h4 className="text-xs font-bold text-white truncate">
                      {name}
                    </h4>
                    <p className="text-[10px] text-[#CFB28C]/60">
                      Qtd: {item.quantity} × {unitPrice} ETH
                    </p>
                  </div>
                  <span className="text-xs font-bold text-[#E89B55]">
                    {(unitPrice * item.quantity).toFixed(2)} ETH
                  </span>
                </div>
              );
            })}
          </div>

          <div className="space-y-2 pt-2 border-t border-[#2A1C16] text-xs">
            <div className="flex justify-between text-[#CFB28C]">
              <span>Subtotal</span>
              <span className="text-white font-bold">{cartTotalNumber.toFixed(2)} ETH</span>
            </div>
            <div className="flex justify-between text-[#CFB28C]">
              <span>Taxa de rede (estimada)</span>
              <span className="text-white font-bold">{networkFee} ETH</span>
            </div>
            <div className="flex justify-between text-sm font-black text-white pt-2 border-t border-[#2A1C16]">
              <span>TOTAL</span>
              <span className="text-[#E89B55]">{totalEth} ETH</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export const checkoutRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/checkout',
  component: CheckoutContent,
});