/* eslint-disable react-refresh/only-export-components */

import { createRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { rootRoute } from './__root';
import { useCart } from '../context/CartContext';
import { api } from '../services/api';
import { NFT } from '../types';

function CartPageContent() {
  const navigate = useNavigate();
  const {
    cart,
    removeFromCart,
    addToCart,
    totalEth,
    appliedDiscount,
    discountAmountEth,
    finalTotalEth,
    appliedCoupon,
    couponError,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [promoCode, setPromoCode] = useState('');
  const [recommendedNfts, setRecommendedNfts] = useState<NFT[]>([]);

  useEffect(() => {
    async function loadRecommendations() {
      try {
        const response = await api.get('/api/nfts');
        const list = Array.isArray(response.data)
          ? response.data
          : response.data?.data || [];
        setRecommendedNfts(list.slice(0, 5));
      } catch (err) {
        console.error('Erro ao carregar recomendações:', err);
      }
    }

    loadRecommendations();
  }, []);

  const handleApplyCoupon = () => {
    if (applyCoupon(promoCode)) {
      setPromoCode('');
    }
  };

  const networkFee = cart.length > 0 ? 0.016 : 0;
  const grandTotal = finalTotalEth + networkFee;

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#CFB28C]/60 flex items-center gap-2">
        <Link to="/" className="hover:text-white transition-colors">
          Início
        </Link>
        <span>/</span>
        <Link to="/" className="hover:text-white transition-colors">
          Mercado
        </Link>
        <span>/</span>
        <span className="text-[#CFB28C]">Carrinho</span>
      </nav>

      {cart.length === 0 ? (
        <div className="bg-[#1B110B] border border-[#2A1C16] rounded-2xl p-12 text-center space-y-4">
          <span className="text-5xl opacity-30">🛒</span>
          <h2 className="text-2xl font-bold text-white">Seu carrinho está vazio</h2>
          <p className="text-sm text-[#CFB28C]/70">
            Explore o catálogo para adicionar NFTs exclusivos à sua coleção.
          </p>
          <Link
            to="/"
            className="inline-block px-6 py-3 bg-[#E89B55] hover:bg-[#d88a44] text-[#120A06] font-bold text-sm rounded-xl transition-colors mt-2"
          >
            Explorar Mercado
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          {/* Tabela de Produtos (8 colunas) */}
          <div className="lg:col-span-8 bg-[#1B110B] border border-[#2A1C16] rounded-2xl p-6 overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead>
                <tr className="border-b border-[#2A1C16] text-[#CFB28C]/60 uppercase tracking-wider pb-4">
                  <th className="pb-4 font-semibold">NFTs</th>
                  <th className="pb-4 font-semibold">Preço</th>
                  <th className="pb-4 font-semibold text-center">Edições</th>
                  <th className="pb-4 font-semibold">Total</th>
                  <th className="pb-4 font-semibold text-right"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#2A1C16]">
                {cart.map(({ nft, quantity }) => {
                  const rawPrice =
                    typeof nft.priceEth === 'string' || typeof nft.priceEth === 'number'
                      ? nft.priceEth
                      : typeof nft.price === 'string' || typeof nft.price === 'number'
                      ? nft.price
                      : '0';

                  const price =
                    typeof rawPrice === 'number'
                      ? rawPrice
                      : parseFloat(
                          String(rawPrice).replace(',', '.').replace(/[^0-9.]/g, '')
                        ) || 0;

                  return (
                    <tr key={nft.id} className="group">
                      {/* NFT / Imagem / Nome */}
                      <td className="py-4 pr-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={nft.image}
                            alt={nft.name || nft.title}
                            className="w-14 h-14 object-cover rounded-xl bg-[#120A06]"
                          />
                          <div>
                            <h4 className="font-bold text-white text-sm truncate max-w-45">
                              {nft.name || nft.title}
                            </h4>
                            <span className="text-[10px] text-[#CFB28C]/60 block">
                              ID do Token: #{nft.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Preço unitário */}
                      <td className="py-4 text-[#CFB28C] font-semibold whitespace-nowrap">
                        {price.toFixed(2)} ETH
                      </td>

                      {/* Quantidade */}
                      <td className="py-4">
                        <div className="flex items-center justify-center gap-2 border border-[#2A1C16] rounded-lg bg-[#120A06] w-fit mx-auto px-2 py-1">
                          <button
                            onClick={() => {
                              if (quantity > 1) {
                                addToCart(nft, -1);
                              } else {
                                removeFromCart(nft.id);
                              }
                            }}
                            className="text-[#CFB28C] hover:text-white px-1 font-bold"
                          >
                            -
                          </button>
                          <span className="text-white font-bold text-xs px-2">
                            {quantity}
                          </span>
                          <button
                            onClick={() => addToCart(nft, 1)}
                            className="text-[#CFB28C] hover:text-white px-1 font-bold"
                          >
                            +
                          </button>
                        </div>
                      </td>

                      {/* Subtotal por item */}
                      <td className="py-4 text-white font-bold whitespace-nowrap">
                        {(price * quantity).toFixed(2)} ETH
                      </td>

                      {/* Remover */}
                      <td className="py-4 text-right">
                        <button
                          onClick={() => removeFromCart(nft.id)}
                          className="text-[#CFB28C]/40 hover:text-red-400 p-2 transition-colors"
                          title="Remover NFT"
                        >
                          🗑️
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          {/* Resumo da Carteira (4 colunas) */}
          <div className="lg:col-span-4 bg-[#1B110B] border border-[#2A1C16] rounded-2xl p-6 space-y-6">
            <h3 className="text-base font-bold text-white uppercase tracking-wider border-b border-[#2A1C16] pb-4">
              Resumo da carteira
            </h3>

            {/* Código Promocional */}
            <div className="space-y-2">
              <label className="text-xs text-[#CFB28C]/80 font-medium block">
                Código promocional
              </label>
              {appliedCoupon ? (
                <div className="flex items-center justify-between bg-[#120A06] border border-[#2A1C16] rounded-xl px-3 py-2 text-xs">
                  <span className="text-green-400 font-semibold">
                    ✓ {appliedCoupon} ({appliedDiscount}% off)
                  </span>
                  <button
                    onClick={removeCoupon}
                    className="text-red-400 hover:text-red-300 text-xs underline ml-2"
                  >
                    Remover
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    placeholder="Digite o código promocional..."
                    value={promoCode}
                    onChange={(e) => setPromoCode(e.target.value)}
                    className="flex-1 bg-[#120A06] border border-[#2A1C16] rounded-xl px-3 py-2 text-xs text-white placeholder-[#CFB28C]/30 focus:outline-none focus:border-[#E89B55]"
                  />
                  <button
                    onClick={handleApplyCoupon}
                    className="bg-[#E89B55] hover:bg-[#d88a44] text-[#120A06] font-bold text-xs px-4 py-2 rounded-xl transition-colors"
                  >
                    Aplicar
                  </button>
                </div>
              )}
              {couponError && (
                <p className="text-xs text-red-400 mt-1">{couponError}</p>
              )}
            </div>

            {/* Valores e Taxas */}
            <div className="space-y-3 text-xs text-[#CFB28C]/80 border-t border-[#2A1C16] pt-4">
              <div className="flex justify-between">
                <span>Subtotal</span>
                <span className="text-white font-bold">
                  {totalEth.toFixed(2)} ETH
                </span>
              </div>

              {appliedDiscount > 0 && (
                <div className="flex justify-between text-green-400">
                  <span>Desconto ({appliedCoupon})</span>
                  <span>(-) {discountAmountEth.toFixed(3)} ETH</span>
                </div>
              )}

              <div className="flex justify-between items-baseline">
                <div>
                  <span>Taxa de rede</span>
                  <span className="text-[10px] text-[#CFB28C]/50 block">
                    Taxa estimada
                  </span>
                </div>
                <span className="text-white font-bold">
                  {networkFee.toFixed(3)} ETH
                </span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline border-t border-[#2A1C16] pt-4 text-sm font-black">
              <span className="text-white uppercase">Total</span>
              <span className="text-lg text-white">
                {grandTotal.toFixed(3)} ETH
              </span>
            </div>

            {/* Ações */}
            <div className="space-y-3 pt-2">
              <button
                onClick={() => navigate({ to: '/checkout' })}
                className="w-full py-3.5 bg-[#E89B55] hover:bg-[#d88a44] text-[#120A06] font-bold text-sm rounded-xl transition-colors shadow-md"
              >
                CONECTAR E FINALIZAR
              </button>

              <Link
                to="/"
                className="block text-center text-xs text-[#CFB28C]/70 hover:text-white transition-colors"
              >
                Continuar explorando
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Recomendados */}
      {recommendedNfts.length > 0 && (
        <div className="border-t border-[#2A1C16] pt-10 space-y-6">
          <h3 className="text-base font-bold text-[#E89B55] uppercase tracking-wider">
            Colecionadores também viram
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
            {recommendedNfts.map((item) => (
              <Link
                key={item.id}
                to="/nft/$id"
                params={{ id: String(item.id) }}
                className="bg-[#1B110B] border border-[#2A1C16] rounded-xl overflow-hidden hover:border-[#E89B55] transition-all group p-3"
              >
                <div className="aspect-square overflow-hidden rounded-lg mb-2">
                  <img
                    src={item.image}
                    alt={item.name || item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                  />
                </div>
                <h4 className="text-xs font-bold text-white truncate">
                  {item.name || item.title}
                </h4>
                <p className="text-[10px] text-[#E89B55] font-bold mt-1">
                  {typeof item.priceEth === 'string' ||
                  typeof item.priceEth === 'number'
                    ? item.priceEth
                    : '0.99'}{' '}
                  ETH
                </p>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export const cartRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/cart',
  component: CartPageContent,
});