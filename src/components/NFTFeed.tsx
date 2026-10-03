import { useState, useEffect, useMemo } from 'react';
import { NftSearchSchema } from '../routes/index';
import { FilterSidebar } from './FilterSidebar';
import { NFTCard } from './NFTCard';
import { useNFTs } from '../services/api';
import { NFT } from '../types';
import { mockNFTs } from '../mocks/data';
import { useSocket } from '../context/SocketContext';
import { Skeleton } from "./Skeleton";

interface ExtendedNFT extends NFT {
    network?: string;
    isNew?: boolean;
    isTrending?: boolean;
}

interface NFTFeedProps {
    searchParams?: NftSearchSchema;
    onFilterChange?: (newFilters: Partial<NftSearchSchema>) => void;
}

export function NFTFeed({ searchParams, onFilterChange }: NFTFeedProps) {
    const { socket } = useSocket();

    useEffect(() => {
        if (!socket) return;

        socket.on('nft.updated', (updatedNft: { id: string; price: string }) => {
            console.log('🔥 NFT Atualizado via Socket:', updatedNft);
        });

        return () => {
            socket.off('nft.updated');
        };
    }, [socket]);

    // Lê os valores diretamente das props enviadas pela URL
    const selectedCategory = searchParams?.category || '';
    const maxPrice = searchParams?.maxPrice ?? 999;
    const selectedNetwork = searchParams?.network || '';
    const sortBy = searchParams?.sort || 'recent';

    // Controle local para abas secundárias
    const [activeTab, setActiveTab] = useState<'all' | 'new' | 'trending'>('all');

    // Funções que atualizam os filtros na URL
    const handleCategoryChange = (category: string) => {
        onFilterChange?.({ category });
    };

    const handlePriceChange = (price: number) => {
        onFilterChange?.({ maxPrice: price });
    };

    const handleNetworkChange = (network: string) => {
        onFilterChange?.({ network });
    };

    const handleSortChange = (sort: string) => {
        onFilterChange?.({ sort });
    };

    // Função para limpar todos os filtros aplicados
    const handleClearFilters = () => {
        onFilterChange?.({
            category: '',
            maxPrice: 999,
            network: '',
            sort: 'recent',
        });
        setActiveTab('all');
    };

    const queryCategory =
        selectedCategory && selectedCategory !== 'all' ? selectedCategory : undefined;

    // Extrai o refetch para permitir tentar novamente em caso de falha
    const { data, isLoading, isError, refetch } = useNFTs({
        category: queryCategory,
    });

    // Extração dos dados da API
    let fetchedNFTs: ExtendedNFT[] = [];
    if (Array.isArray(data)) {
        fetchedNFTs = data as ExtendedNFT[];
    } else if (data && typeof data === 'object') {
        const res = data as Record<string, unknown>;
        if (Array.isArray(res.nfts)) fetchedNFTs = res.nfts as ExtendedNFT[];
        else if (Array.isArray(res.data)) fetchedNFTs = res.data as ExtendedNFT[];
    }

    // Fallback caso a API não devolva lista
    const fallbackList = (mockNFTs as unknown as ExtendedNFT[]) || [];
    const nftsArray = fetchedNFTs.length > 0 ? fetchedNFTs : fallbackList;

    // Filtragem otimizada com useMemo
    const filteredNFTs = useMemo(() => {
        return nftsArray.filter((nft: ExtendedNFT) => {
            if (
                selectedCategory &&
                selectedCategory !== 'all' &&
                selectedCategory.trim() !== ''
            ) {
                const nftCat = (nft.category || '').toLowerCase().trim();
                const selCat = selectedCategory.toLowerCase().trim();
                if (nftCat !== selCat && !nftCat.includes(selCat)) {
                    return false;
                }
            }

            const rawPrice = nft.priceEth ?? nft.price ?? '0';
            const priceEth =
                typeof rawPrice === 'number'
                    ? rawPrice
                    : parseFloat(String(rawPrice).replace(',', '.').replace(/[^0-9.]/g, '')) || 0;

            if (maxPrice > 0 && priceEth > maxPrice) {
                return false;
            }

            if (selectedNetwork && selectedNetwork.trim() !== '') {
                const nftNet = (nft.network || '').toLowerCase().trim();
                const selNet = selectedNetwork.toLowerCase().trim();
                if (nftNet !== selNet) return false;
            }

            if (activeTab === 'new' && !nft.isNew) return false;
            if (activeTab === 'trending' && !nft.isTrending) return false;

            return true;
        });
    }, [nftsArray, selectedCategory, maxPrice, selectedNetwork, activeTab]);

    // Ordenação otimizada com useMemo
    const sortedNFTs = useMemo(() => {
        return [...filteredNFTs].sort((a: ExtendedNFT, b: ExtendedNFT) => {
            const rawPriceA = a.priceEth ?? a.price ?? '0';
            const rawPriceB = b.priceEth ?? b.price ?? '0';

            const priceA =
                typeof rawPriceA === 'number'
                    ? rawPriceA
                    : parseFloat(String(rawPriceA).replace(',', '.').replace(/[^0-9.]/g, '')) || 0;

            const priceB =
                typeof rawPriceB === 'number'
                    ? rawPriceB
                    : parseFloat(String(rawPriceB).replace(',', '.').replace(/[^0-9.]/g, '')) || 0;

            if (sortBy === 'price_low') return priceA - priceB;
            if (sortBy === 'price_high') return priceB - priceA;

            const idA = typeof a.id === 'number' ? a.id : parseInt(String(a.id || '0'), 10);
            const idB = typeof b.id === 'number' ? b.id : parseInt(String(b.id || '0'), 10);

            return idB - idA;
        });
    }, [filteredNFTs, sortBy]);

    return (
        <div className="flex gap-8" aria-busy={isLoading} aria-live="polite" role="region" aria-label="Catálogo de NFTs">
            {/* Sidebar de Filtros */}
            <div className="w-64 shrink-0 hidden lg:block">
                <FilterSidebar
                    selectedCategory={selectedCategory}
                    onSelectCategory={handleCategoryChange}
                    priceRange={maxPrice}
                    onPriceChange={handlePriceChange}
                    selectedNetwork={selectedNetwork}
                    onNetworkChange={handleNetworkChange}
                />
            </div>

            {/* Grid Principal e Controles */}
            <div className="flex-1">
                {/* Abas e Filtro de Ordenação */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
                    <div className="flex gap-2 p-1 bg-neutral-900 rounded-xl border border-neutral-800">
                        <button
                            onClick={() => setActiveTab('all')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'all'
                                    ? 'bg-neutral-800 text-white shadow'
                                    : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            Todos
                        </button>
                        <button
                            onClick={() => setActiveTab('new')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'new'
                                    ? 'bg-neutral-800 text-white shadow'
                                    : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            Novos
                        </button>
                        <button
                            onClick={() => setActiveTab('trending')}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${activeTab === 'trending'
                                    ? 'bg-neutral-800 text-white shadow'
                                    : 'text-neutral-400 hover:text-white'
                                }`}
                        >
                            Em alta
                        </button>
                    </div>

                    <select
                        value={sortBy}
                        aria-label="Ordenar itens do catálogo"
                        onChange={(e) => handleSortChange(e.target.value)}
                        className="bg-neutral-900 border border-neutral-800 rounded-xl px-4 py-2 text-sm text-neutral-200 focus:outline-none focus:border-purple-500"
                    >
                        <option value="recent">Mais recentes</option>
                        <option value="price_low">Menor preço</option>
                        <option value="price_high">Maior preço</option>
                    </select>
                </div>

                {/* Renderização da Lista de NFTs */}
                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[1, 2, 3, 4, 5, 6].map((i) => (
                            <div
                                key={i}
                                className="flex flex-col space-y-4 p-4 h-96 rounded-2xl bg-neutral-900/50 border border-neutral-800"
                            >
                                {/* Imagem em Skeleton */}
                                <Skeleton className="w-full h-56 rounded-xl" />

                                {/* Título em Skeleton */}
                                <Skeleton className="h-5 w-3/4" />

                                {/* Preço e botão em Skeleton */}
                                <div className="flex justify-between items-center pt-2">
                                    <Skeleton className="h-4 w-1/3" />
                                    <Skeleton className="h-8 w-24 rounded-lg" />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : isError ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 text-center px-4">
                        <div className="w-12 h-12 rounded-full bg-red-500/10 text-red-400 flex items-center justify-center mb-4 text-xl">
                            ⚠️
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2">
                            Falha ao carregar o feed
                        </h2>
                        <p className="text-neutral-400 text-sm max-w-md mb-6">
                            Não foi possível obter a lista de NFTs no momento. Verifique sua conexão ou tente novamente.
                        </p>
                        <button
                            onClick={() => refetch?.()}
                            className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white font-medium text-sm rounded-xl transition-all shadow-lg shadow-purple-600/20"
                        >
                            Tentar novamente
                        </button>
                    </div>
                ) : sortedNFTs.length === 0 ? (
                    <div className="flex flex-col items-center justify-center py-16 bg-neutral-900/40 rounded-2xl border border-neutral-800 text-center px-4">
                        <div className="w-12 h-12 rounded-full bg-neutral-800 text-neutral-400 flex items-center justify-center mb-4 text-xl">
                            🔍
                        </div>
                        <h2 className="text-lg font-semibold text-white mb-2">
                            Nenhum NFT encontrado
                        </h2>
                        <p className="text-neutral-400 text-sm max-w-md mb-6">
                            Nenhum item corresponde aos filtros selecionados no momento. Tente ajustar suas preferências.
                        </p>
                        <button
                            onClick={handleClearFilters}
                            className="px-5 py-2.5 bg-neutral-800 hover:bg-neutral-700 text-neutral-200 font-medium text-sm rounded-xl transition-all border border-neutral-700"
                        >
                            Limpar todos os filtros
                        </button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {sortedNFTs.map((nft) => (
                            <NFTCard key={nft.id} nft={nft} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}