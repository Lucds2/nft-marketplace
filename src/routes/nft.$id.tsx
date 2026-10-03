/* eslint-disable react-refresh/only-export-components */
import { createRoute, Link, useNavigate } from '@tanstack/react-router';
import { useEffect, useState } from 'react';
import { rootRoute } from './__root';
import { NFT } from '../types';
import { api } from '../services/api';
import { useCart } from '../context/CartContext';
import { mockNFTs } from '../mocks/data';

function NFTDetailContent() {
  const { id } = nftDetailRoute.useParams();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const [nft, setNft] = useState<NFT | null>(null);
  const [allNfts, setAllNfts] = useState<NFT[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'details' | 'reviews'>('details');

  useEffect(() => {
    async function loadNFTData() {
      try {
        setLoading(true);
        setError(false);

        let list: Record<string, unknown>[] = [];

        try {
          const response = await api.get('/api/nfts');
          const rawData = response.data;

          if (Array.isArray(rawData)) {
            list = rawData;
          } else if (Array.isArray(rawData?.data)) {
            list = rawData.data;
          } else if (Array.isArray(rawData?.nfts)) {
            list = rawData.nfts;
          }
        } catch (apiErr) {
          console.warn('Falha na API, usando dados de mock local:', apiErr);
        }

        // Se a API não retornou nada, usa os mockNFTs importados do data.ts
        if (list.length === 0) {
          list = mockNFTs as unknown as Record<string, unknown>[];
        }

        setAllNfts(list as unknown as NFT[]);

        const cleanId = String(id).toLowerCase().trim();

        // 1. Busca exata por ID, slug ou UUID
        let found = list.find((item) => {
          const itemId = String(
            item.id ?? item._id ?? item.uuid ?? item.slug ?? ''
          )
            .toLowerCase()
            .trim();
          return (
            itemId === cleanId ||
            decodeURIComponent(itemId) === decodeURIComponent(cleanId)
          );
        });

        // 2. Fallback: Busca por nome
        if (!found) {
          found = list.find((item) => {
            const name = String(item.name ?? item.title ?? '').toLowerCase();
            return name.includes(cleanId) || cleanId.includes(name);
          });
        }

        // 3. Fallback: Posição do Índice
        if (!found && !isNaN(Number(id))) {
          const index = Number(id) - 1;
          if (list[index]) {
            found = list[index];
          } else if (list[0]) {
            found = list[0];
          }
        }

        // 4. Fallback: Primeiro item da lista
        if (!found && list.length > 0) {
          found = list[0];
        }

        if (found) {
          setNft(found as unknown as NFT);
        } else {
          setError(true);
        }
      } catch (err) {
        console.error('Erro ao carregar detalhes do NFT:', err);

        // Tentativa final de resgate direto no mockNFTs em caso de erro crítico
        const fallback = (mockNFTs as unknown as Record<string, unknown>[]).find(
          (item) => String(item.id) === String(id)
        ) || mockNFTs[0];

        if (fallback) {
          setNft(fallback as unknown as NFT);
          setError(false);
        } else {
          setError(true);
        }
      } finally {
        setLoading(false);
      }
    }

    loadNFTData();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#CFB28C]">
        <div className="animate-pulse flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-[#E89B55] border-t-transparent rounded-full animate-spin"></div>
          <p className="text-sm font-medium">Carregando detalhes do NFT...</p>
        </div>
      </div>
    );
  }

  if (error || !nft) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center text-[#CFB28C]">
        <h2 className="text-2xl font-bold text-white mb-4">NFT não encontrado</h2>
        <p className="mb-6 text-sm text-[#CFB28C]/80">
          O NFT solicitado não existe no catálogo.
        </p>
        <Link
          to="/"
          className="inline-block px-6 py-2.5 bg-[#E89B55] hover:bg-[#d88a44] text-[#120A06] font-bold text-sm rounded-xl transition-colors"
        >
          Voltar para o catálogo
        </Link>
      </div>
    );
  }

  const displayPrice = (() => {
    if (typeof nft.priceEth === 'string' || typeof nft.priceEth === 'number')
      return String(nft.priceEth);
    if (typeof nft.price === 'string' || typeof nft.price === 'number')
      return String(nft.price);
    if (typeof nft.price === 'object' && nft.price !== null) {
      const p = nft.price as Record<string, unknown>;
      if (p.eth) return String(p.eth);
    }
    return '1.39';
  })();

  const title = nft.name || nft.title || `Violet Nomad #${nft.id || '314'}`;
  const otherNfts = allNfts
    .filter((item) => String(item.id) !== String(nft.id))
    .slice(0, 5);

  return (
    <div className="max-w-7xl mx-auto py-6 space-y-12">
      {/* Breadcrumb */}
      <nav className="text-xs text-[#CFB28C]/60 flex items-center gap-2">
        <Link to="/" className="hover:text-white transition-colors">
          Início
        </Link>
        <span>/</span>
        <span className="text-[#CFB28C]">Mercado</span>
      </nav>

      {/* Bloco Principal do Produto */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        {/* Galeria de Imagens (5 colunas) */}
        <div className="lg:col-span-5 flex gap-4">
          <div className="flex flex-col gap-3">
            {[1, 2, 3, 4].map((index) => (
              <button
                key={index}
                className="w-16 h-16 rounded-xl border border-[#2A1C16] overflow-hidden hover:border-[#E89B55] transition-colors bg-[#1B110B]"
              >
                <img
                  src={nft.image}
                  alt=""
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>

          <div className="flex-1 bg-[#1B110B] border border-[#2A1C16] rounded-2xl p-3 relative group overflow-hidden">
            <img
              src={nft.image}
              alt={title}
              className="w-full aspect-square object-cover rounded-xl"
            />
            <button className="absolute top-6 right-6 p-2 bg-[#120A06]/80 text-white rounded-full hover:bg-[#E89B55] hover:text-[#120A06] transition-colors">
              🔍
            </button>
          </div>
        </div>

        {/* Detalhes e Ações (7 colunas) */}
        <div className="lg:col-span-7 space-y-6">
          <div>
            <h1 className="text-3xl font-black text-white uppercase tracking-wide mb-2">
              {title}
            </h1>
            <div className="flex items-center gap-3">
              <span className="text-2xl font-black text-[#E89B55]">
                {displayPrice} ETH
              </span>
              <div className="flex items-center gap-1 text-[#E89B55] text-sm">
                ★★★★★{' '}
                <span className="text-xs text-[#CFB28C]/60">
                  (19 avaliações de colecionadores)
                </span>
              </div>
            </div>
          </div>

          {/* Sobre este NFT */}
          <div className="space-y-2 border-t border-[#2A1C16] pt-4">
            <h3 className="text-xs font-bold text-[#CFB28C] uppercase tracking-wider">
              Sobre este NFT:
            </h3>
            <p className="text-xs text-[#CFB28C]/80 leading-relaxed">
              {nft.description ||
                'Um colecionável digital finalizado à mão da coleção Kurio Editions, verificado na Ethereum. A obra explora identidade, movimento e luz em um mundo digital sem fronteiras.'}
            </p>
          </div>

          {/* Edições */}
          <div className="space-y-2">
            <h3 className="text-xs font-bold text-[#CFB28C] uppercase tracking-wider">
              Edição:
            </h3>
            <div className="flex gap-2 text-[10px] font-bold">
              <span className="px-3 py-1 bg-[#2A1C16] text-[#CFB28C] rounded">
                1/1
              </span>
              <span className="px-3 py-1 bg-[#2A1C16] text-[#CFB28C] rounded">
                1/10
              </span>
              <span className="px-3 py-1 bg-[#E89B55] text-[#120A06] rounded">
                1/50
              </span>
              <span className="px-3 py-1 border border-[#2A1C16] text-[#CFB28C] rounded">
                ABERTA
              </span>
            </div>
          </div>

          {/* Seletor de Quantidade e Botões de Ação */}
          <div className="flex items-center gap-4 pt-2">
            <div className="flex items-center border border-[#2A1C16] rounded-xl bg-[#1B110B]">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-3 py-2 text-[#CFB28C] hover:text-white"
              >
                -
              </button>
              <span className="px-4 text-sm font-bold text-white">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                className="px-3 py-2 text-[#CFB28C] hover:text-white"
              >
                +
              </button>
            </div>

            <button
              onClick={() => {
                addToCart(nft, quantity);
                navigate({ to: '/cart' });
              }}
              className="flex-1 py-3 bg-[#E89B55] hover:bg-[#d88a44] text-[#120A06] font-bold text-sm rounded-xl transition-colors shadow-md"
            >
              COMPRAR
            </button>

            <button className="px-4 py-3 border border-[#2A1C16] text-[#CFB28C] hover:text-white hover:border-[#E89B55] font-bold text-sm rounded-xl transition-colors flex items-center gap-2">
              ♡ Favoritar
            </button>
          </div>

          {/* Metadados adicionais */}
          <div className="space-y-1 text-xs text-[#CFB28C]/80 pt-2 border-t border-[#2A1C16]">
            <p>
              <strong className="text-[#CFB28C]">ID do token:</strong> #{nft.id || '0314'}
            </p>
            <p>
              <strong className="text-[#CFB28C]">Coleção:</strong> Kurio Apes
            </p>
            <p>
              <strong className="text-[#CFB28C]">Atributos:</strong> Chapéu, Roxo, Estilo Urbano
            </p>
            <p className="flex items-center gap-2 pt-2">
              <strong className="text-[#CFB28C]">Compartilhar este NFT:</strong>
              <span className="text-[#E89B55] cursor-pointer hover:underline">
                LinkedIn
              </span>{' '}
              •
              <span className="text-[#E89B55] cursor-pointer hover:underline">
                Email
              </span>{' '}
              •
              <span className="text-[#E89B55] cursor-pointer hover:underline">
                Twitter
              </span>
            </p>
          </div>
        </div>
      </div>

      {/* Abas de Detalhes Adicionais */}
      <div className="border-t border-[#2A1C16] pt-8 space-y-6">
        <div className="flex gap-8 border-b border-[#2A1C16] pb-3">
          <button
            onClick={() => setActiveTab('details')}
            className={`text-sm font-bold transition-colors ${
              activeTab === 'details'
                ? 'text-[#E89B55] border-b-2 border-[#E89B55] pb-3 -mb-3.5'
                : 'text-[#CFB28C]/60 hover:text-white'
            }`}
          >
            Detalhes do NFT
          </button>
          <button
            onClick={() => setActiveTab('reviews')}
            className={`text-sm font-bold transition-colors ${
              activeTab === 'reviews'
                ? 'text-[#E89B55] border-b-2 border-[#E89B55] pb-3 -mb-3.5'
                : 'text-[#CFB28C]/60 hover:text-white'
            }`}
          >
            Avaliações de colecionadores (19)
          </button>
        </div>

        {activeTab === 'details' ? (
          <div className="text-xs text-[#CFB28C]/80 space-y-3 leading-relaxed max-w-4xl">
            <p>
              {title} é uma obra digital 1/50 finalizada à mão da coleção Kurio
              Editions. Cada atributo fica armazenado nos metadados do token e
              verificado na Ethereum.
            </p>
            <p>
              <strong>Rede:</strong> Cunhado na Ethereum com procedência imutável e
              metadados armazenados no IPFS.
            </p>
            <p>
              <strong>Contrato:</strong> Direitos autorais do criador: 5% nas
              vendas secundárias, pagos automaticamente pelos mercados
              compatíveis.
            </p>
            <p>
              <strong>Direitos autorais:</strong> 0x74d2...79E8 - Contrato
              inteligente ERC-721 verificado.
            </p>
          </div>
        ) : (
          <div className="text-xs text-[#CFB28C]/80 space-y-2">
            <p>
              ⭐ "Uma peça incrível para qualquer coleção digital." —{' '}
              <em>Colecionador #102</em>
            </p>
            <p>
              ⭐ "Traços e iluminação espetaculares!" — <em>CryptoFan</em>
            </p>
          </div>
        )}
      </div>

      {/* Carrossel "Mais desta coleção" */}
      <div className="border-t border-[#2A1C16] pt-10 space-y-6">
        <h2 className="text-base font-bold text-[#E89B55] uppercase tracking-wider">
          Mais desta coleção
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
          {otherNfts.map((item) => (
            <Link
              key={item.id}
              to="/nft/$id"
              params={{ id: String(item.id) }}
              className="bg-[#1B110B] border border-[#2A1C16] rounded-xl overflow-hidden hover:border-[#E89B55] transition-all group p-2"
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
    </div>
  );
}

export const nftDetailRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/nft/$id',
  component: NFTDetailContent,
});