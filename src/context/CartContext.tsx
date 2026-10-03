/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { NFT } from '../types';

export interface CartItem {
  nft: NFT;
  quantity: number;
}

export interface Coupon {
  code: string;
  discountPercentage: number;
  status: 'ACTIVE' | 'EXPIRED';
}

// Tabela de cupões simulada
const VALID_COUPONS: Record<string, Coupon> = {
  DESCONTO10: { code: 'DESCONTO10', discountPercentage: 10, status: 'ACTIVE' },
  WEB3VIP: { code: 'WEB3VIP', discountPercentage: 20, status: 'ACTIVE' },
  EXPIRADO15: { code: 'EXPIRADO15', discountPercentage: 15, status: 'EXPIRED' },
};

interface CartContextData {
  cart: CartItem[];
  addToCart: (nft: NFT, quantity?: number) => void;
  removeFromCart: (nftId: string | number) => void;
  clearCart: () => void;
  totalItems: number;
  totalEth: number;
  appliedDiscount: number; // Percentual ex: 10 para 10%
  discountAmountEth: number; // Valor em ETH do desconto
  finalTotalEth: number; // Total com desconto aplicado (sem taxas)
  appliedCoupon: string | null;
  couponError: string | null;
  applyCoupon: (code: string) => boolean;
  removeCoupon: () => void;
  isCartOpen: boolean;
  setIsCartOpen: (isOpen: boolean) => void;
}

const CART_STORAGE_KEY = 'nft_marketplace_cart';

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<CartItem[]>(() => {
    if (typeof window === 'undefined') return [];
    try {
      const storedCart = localStorage.getItem(CART_STORAGE_KEY);
      return storedCart ? JSON.parse(storedCart) : [];
    } catch (error) {
      console.error('Erro ao ler carrinho do localStorage:', error);
      return [];
    }
  });

  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);
  const [appliedDiscount, setAppliedDiscount] = useState<number>(0);
  const [couponError, setCouponError] = useState<string | null>(null);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
    } catch (error) {
      console.error('Erro ao salvar carrinho no localStorage:', error);
    }
  }, [cart]);

  const addToCart = (nft: NFT, quantityToAdd = 1) => {
    setCart((prevCart) => {
      const existingIndex = prevCart.findIndex(
        (item) => String(item.nft.id) === String(nft.id)
      );

      if (existingIndex > -1) {
        const updated = [...prevCart];
        updated[existingIndex].quantity += quantityToAdd;
        return updated;
      }

      return [...prevCart, { nft, quantity: quantityToAdd }];
    });
    setIsCartOpen(true);
  };

  const removeFromCart = (nftId: string | number) => {
    setCart((prevCart) =>
      prevCart.filter((item) => String(item.nft.id) !== String(nftId))
    );
  };

  const clearCart = () => {
    setCart([]);
    setAppliedCoupon(null);
    setAppliedDiscount(0);
    setCouponError(null);
  };

  const applyCoupon = (code: string): boolean => {
    setCouponError(null);
    const normalizedCode = code.trim().toUpperCase();

    if (!normalizedCode) {
      setCouponError('Insira um código de cupão.');
      return false;
    }

    const coupon = VALID_COUPONS[normalizedCode];

    if (!coupon) {
      setCouponError('Cupão inválido.');
      return false;
    }

    if (coupon.status === 'EXPIRED') {
      setCouponError('Este cupão já expirou.');
      return false;
    }

    setAppliedCoupon(coupon.code);
    setAppliedDiscount(coupon.discountPercentage);
    setCouponError(null);
    return true;
  };

  const removeCoupon = () => {
    setAppliedCoupon(null);
    setAppliedDiscount(0);
    setCouponError(null);
  };

  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);

  const totalEth = cart.reduce((sum, item) => {
    const rawPrice =
      typeof item.nft.priceEth === 'string' || typeof item.nft.priceEth === 'number'
        ? item.nft.priceEth
        : typeof item.nft.price === 'string' || typeof item.nft.price === 'number'
        ? item.nft.price
        : '0';

    const numPrice =
      typeof rawPrice === 'number'
        ? rawPrice
        : parseFloat(String(rawPrice).replace(',', '.').replace(/[^0-9.]/g, '')) || 0;

    return sum + numPrice * item.quantity;
  }, 0);

  const discountAmountEth = (totalEth * appliedDiscount) / 100;
  const finalTotalEth = Math.max(0, totalEth - discountAmountEth);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        clearCart,
        totalItems,
        totalEth,
        appliedDiscount,
        discountAmountEth,
        finalTotalEth,
        appliedCoupon,
        couponError,
        applyCoupon,
        removeCoupon,
        isCartOpen,
        setIsCartOpen,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart precisa ser usado dentro de um CartProvider');
  }
  return context;
}