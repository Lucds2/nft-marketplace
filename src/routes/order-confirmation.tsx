/* eslint-disable react-refresh/only-export-components */
import { createRoute, Link } from '@tanstack/react-router';
import { useState, useEffect } from 'react';
import { rootRoute } from './__root';
import { useSocket } from '../context/SocketContext';

interface OrderItem {
  nft: {
    id: string | number;
    name?: string;
    title?: string;
    image: string;
    priceEth?: string | number;
    price?: string | number;
  };
  quantity: number;
}

interface OrderData {
  id: string;
  hash?: string;
  items: OrderItem[];
  total: string;
  status?: 'PENDING' | 'CONFIRMED' | 'REJECTED' | string;
}

function OrderConfirmationContent() {
  const { socket } = useSocket();
  const [order, setOrder] = useState<OrderData | null>(() => {
    const saved = sessionStorage.getItem('lastOrder');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (err) {
        console.error('Erro ao ler pedido:', err);
      }
    }
    return null;
  });

  // Escuta atualizações de status em tempo real via WebSocket
  // Escuta atualizações de status em tempo real via WebSocket
  useEffect(() => {
    if (!socket) return;

    const handleOrderUpdated = (data: { orderId?: string; id?: string; status: string }) => {
      const updatedId = data.orderId || data.id;

      setOrder((prevOrder) => {
        // Se ainda não existir pedido carregado ou se corresponder ao ID do pedido atual
        if (!prevOrder || prevOrder.id === updatedId) {
          return prevOrder ? { ...prevOrder, status: data.status } : prevOrder;
        }
        return prevOrder;
      });
    };

    socket.on('order.updated', handleOrderUpdated);

    return () => {
      socket.off('order.updated', handleOrderUpdated);
    };
  }, [socket]);

  return (
    <div className="max-w-xl mx-auto py-12 px-4">
      <div className="bg-[#1B110B] border border-[#2A1C16] rounded-2xl p-8 text-center space-y-6 shadow-2xl relative">
        {/* Ícone de Sucesso */}
        <div className="w-16 h-16 bg-[#E89B55]/20 text-[#E89B55] border border-[#E89B55] rounded-full flex items-center justify-center mx-auto text-3xl font-bold">
          ✓
        </div>

        <div>
          <h1 className="text-2xl font-black text-white uppercase tracking-wide">
            PEDIDO CONFIRMADO!
          </h1>
          <p className="text-xs text-[#CFB28C]/80 mt-1">
            Sua transação foi processada com sucesso na blockchain.
          </p>
        </div>

        {/* Detalhes do Pedido */}
      <div className="bg-[#120A06] border border-[#2A1C16] rounded-xl p-4 text-left space-y-3 text-xs">
        <div className="flex justify-between border-b border-[#2A1C16] pb-2">
          <span className="text-[#CFB28C]/60">Status do Pedido:</span>
          <span className={`font-mono font-bold px-2 py-0.5 rounded text-[10px] ${
            order?.status === 'REJECTED'
              ? 'bg-red-500/20 text-red-400 border border-red-500/30'
              : order?.status === 'PENDING'
              ? 'bg-yellow-500/20 text-yellow-400 border border-yellow-500/30'
              : 'bg-green-500/20 text-green-400 border border-green-500/30'
          }`}>
            {order?.status || 'CONFIRMED'}
          </span>
        </div>

        <div className="flex justify-between border-b border-[#2A1C16] pb-2">
          <span className="text-[#CFB28C]/60">Nº do Pedido:</span>
          <span className="text-white font-mono font-bold">
            {order?.id || 'ORD-849201'}
          </span>
        </div>

          {/* Lista de itens no recibo */}
          <div className="space-y-2 pt-2">
            <p className="text-[10px] font-bold text-[#CFB28C] uppercase tracking-wider">
              Itens Adquiridos:
            </p>
            {order?.items && order.items.length > 0 ? (
              order.items.map((item, idx) => {
                const name = item.nft.name || item.nft.title || 'NFT Asset';
                const unitPrice = Number(item.nft.priceEth || item.nft.price || 1.39);
                return (
                  <div key={idx} className="flex justify-between items-center text-xs">
                    <span className="text-white truncate max-w-55">
                      {item.quantity}x {name}
                    </span>
                    <span className="text-[#E89B55] font-bold">
                      {(unitPrice * item.quantity).toFixed(2)} ETH
                    </span>
                  </div>
                );
              })
            ) : (
              <div className="flex justify-between text-xs">
                <span className="text-white">1x Emerald Ape #042</span>
                <span className="text-[#E89B55] font-bold">3.57 ETH</span>
              </div>
            )}
          </div>

          <div className="flex justify-between text-sm font-black text-white pt-3 border-t border-[#2A1C16]">
            <span>TOTAL PAGO:</span>
            <span className="text-[#E89B55]">{order?.total || '7.756'} ETH</span>
          </div>
        </div>

            {/* Controlo de Teste Manual (Apenas para validação de desenvolvimento) */}
        <div className="flex gap-2 pt-2 border-t border-[#2A1C16]">
          <button
            type="button"
            onClick={() => setOrder((prev) => prev ? { ...prev, status: 'PENDING' } : prev)}
            className="flex-1 py-1 text-[10px] font-mono bg-yellow-500/10 text-yellow-400 border border-yellow-500/30 rounded hover:bg-yellow-500/20"
          >
            Simular Pendente
          </button>
          <button
            type="button"
            onClick={() => setOrder((prev) => prev ? { ...prev, status: 'CONFIRMED' } : prev)}
            className="flex-1 py-1 text-[10px] font-mono bg-green-500/10 text-green-400 border border-green-500/30 rounded hover:bg-green-500/20"
          >
            Simular Confirmado
          </button>
          <button
            type="button"
            onClick={() => setOrder((prev) => prev ? { ...prev, status: 'REJECTED' } : prev)}
            className="flex-1 py-1 text-[10px] font-mono bg-red-500/10 text-red-400 border border-red-500/30 rounded hover:bg-red-500/20"
          >
            Simular Recusado
          </button>
        </div>




        {/* Botão de Retorno */}
        <Link
          to="/"
          className="block w-full py-3 bg-[#E89B55] hover:bg-[#d88a44] text-[#120A06] font-bold text-sm rounded-xl transition-colors"
        >
          VOLTAR AO MERCADO
        </Link>
      </div>
    </div>
  );
}

export const orderConfirmationRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/order-confirmation',
  component: OrderConfirmationContent,
});