import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { NFT } from '../types';
import { useAuth } from '../context/AuthContext'; // Ajuste o caminho de acordo com o seu projeto

interface NFTCardProps {
    nft: NFT;
}

export function NFTCard({ nft }: NFTCardProps) {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    // Inicializa o estado diretamente do localStorage sem precisar de useEffect
    const [isFavorite, setIsFavorite] = useState<boolean>(() => {
        if (typeof window === 'undefined') return false;
        try {
            const favorites: (string | number)[] = JSON.parse(
                localStorage.getItem('user_favorites') || '[]'
            );
            return favorites.includes(nft.id);
        } catch {
            return false;
        }
    });

    const toggleFavorite = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        // Redireciona se não estiver autenticado
        if (!isAuthenticated) {
            navigate({ to: '/login' });
            return;
        }

        try {
            const favorites: (string | number)[] = JSON.parse(
                localStorage.getItem('user_favorites') || '[]'
            );

            let updatedFavorites: (string | number)[];
            if (favorites.includes(nft.id)) {
                updatedFavorites = favorites.filter((id) => id !== nft.id);
                setIsFavorite(false);
            } else {
                updatedFavorites = [...favorites, nft.id];
                setIsFavorite(true);
            }

            localStorage.setItem('user_favorites', JSON.stringify(updatedFavorites));
        } catch (error) {
            console.error('Erro ao atualizar favoritos:', error);
        }
    };

    return (
        <div className="bg-[#1B110B] border border-[#2A1C16] rounded-2xl overflow-hidden hover:border-[#E89B55]/50 transition-all group">
            {/* Clique na Imagem direciona para os detalhes do NFT */}
            <Link
                to="/nft/$id"
                params={{ id: String(nft.id) }}
                className="block relative aspect-square overflow-hidden"
            >
                <img
                    src={nft.image}
                    alt={nft.name || nft.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                    decoding="async"
                />

                {/* Botão de Favorito Persistente */}
                <button
                    onClick={toggleFavorite}
                    aria-label="Favoritar NFT"
                    className="absolute top-3 right-3 p-2.5 rounded-full bg-black/40 backdrop-blur-md border border-white/10 hover:scale-110 active:scale-95 transition-all text-white z-10"
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 24 24"
                        fill={isFavorite ? '#E89B55' : 'none'}
                        stroke={isFavorite ? '#E89B55' : 'currentColor'}
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        className="w-5 h-5 transition-colors"
                    >
                        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z" />
                    </svg>
                </button>
            </Link>

            <div className="p-4 space-y-3">
                {/* Clique no Título direciona para os detalhes do NFT */}
                <Link to="/nft/$id" params={{ id: String(nft.id) }}>
                    <h3 className="font-bold text-white text-base hover:text-[#E89B55] transition-colors truncate">
                        {nft.name || nft.title}
                    </h3>
                </Link>

                <div className="flex items-center justify-between text-xs text-[#CFB28C]">
                    <div className="flex items-center gap-2">
                        <img
                            src={nft.creator?.avatar || 'https://i.pravatar.cc/150'}
                            alt={nft.creator?.name}
                            className="w-5 h-5 rounded-full"
                        />
                        <span className="truncate max-w-25">
                            {nft.creator?.name || 'Criador'}
                        </span>
                    </div>

                    <div className="text-right">
                        <span className="block text-[10px] text-[#CFB28C]/60 uppercase">
                            Preço
                        </span>
                        <span className="font-bold text-white">{nft.priceEth} ETH</span>
                    </div>
                </div>
            </div>
        </div>
    );
}