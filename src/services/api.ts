import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { NFT, User } from '../types';

// Instância do Axios
export const api = axios.create({
  baseURL: '',
});

// Filtros aceites na listagem
export interface NFTFilters {
  search?: string;
  category?: string;
}

// Hook para procurar a lista de NFTs com suporte a filtros
export function useNFTs(filters?: NFTFilters) {
  return useQuery<NFT[]>({
    queryKey: ['nfts', filters],
    queryFn: async () => {
      const response = await api.get<NFT[]>('/api/nfts', {
        params: filters,
      });
      return response.data;
    },
  });
}

// Hook para procurar os detalhes de um NFT pelo ID
export function useNFTDetail(id: string) {
  return useQuery<NFT>({
    queryKey: ['nft', id],
    queryFn: async () => {
      const response = await api.get<NFT>(`/api/nfts/${id}`);
      return response.data;
    },
    enabled: Boolean(id),
  });
}

// Hook para procurar o perfil do utilizador
export function useUserProfile() {
  return useQuery<User>({
    queryKey: ['user-profile'],
    queryFn: async () => {
      const response = await api.get<User>('/api/user/profile');
      return response.data;
    },
  });
}