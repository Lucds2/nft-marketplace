export interface User {
  id?: string | number;
  name: string;
  avatar: string;
  email?: string;
  bio?: string;
  walletAddress?: string;
  mainWallet?: string;
  secondaryWallet?: string;
  [key: string]: unknown;
}

export interface NFT {
  id: string | number;
  name?: string;
  title?: string;
  description?: string;
  image?: string;
  priceEth?: string;
  category?: string;
  creator?: User;
  owner?: User;
  featured?: boolean;
  availableQuantity?: number;
  isFavorite?: boolean;
  network?: string;
  isNew?: boolean;
  isTrending?: boolean;
  [key: string]: unknown;
}