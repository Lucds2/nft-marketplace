/* eslint-disable react-refresh/only-export-components */

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

// Tipagem fortemente tipada para evitar o aviso no-explicit-any
export interface MockSocket {
  on: <T = unknown>(event: string, callback: (data: T) => void) => void;
  off: <T = unknown>(event: string, callback?: (data: T) => void) => void;
  emit: <T = unknown>(event: string, data?: T) => void;
  disconnect: () => void;
}

interface SocketContextType {
  socket: MockSocket | null;
  isConnected: boolean;
}

const SocketContext = createContext<SocketContextType>({
  socket: null,
  isConnected: false,
});

export function SocketProvider({ children }: { children: ReactNode }) {
  const [socket, setSocket] = useState<MockSocket | null>(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    const ws = new WebSocket(wsUrl);
    const listeners: Record<string, ((data: unknown) => void)[]> = {};

    // Objeto mock que expõe a API do Socket.IO
    const mockSocket: MockSocket = {
      on: (event, callback) => {
        if (!listeners[event]) listeners[event] = [];
        listeners[event].push(callback as (data: unknown) => void);
      },
      off: (event, callback) => {
        if (!listeners[event]) return;
        if (callback) {
          listeners[event] = listeners[event].filter((cb) => cb !== callback);
        } else {
          delete listeners[event];
        }
      },
      emit: (event, data) => {
        if (ws.readyState === WebSocket.OPEN) {
          ws.send(JSON.stringify({ event, data }));
        }
      },
      disconnect: () => {
        ws.close();
      },
    };

    ws.onopen = () => {
      console.log('✅ [MSW WebSocket] Conectado com sucesso');
      setIsConnected(true);
      setSocket(mockSocket); // Definido assincronamente ao abrir a conexão
    };

    ws.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        const eventName = payload.event || payload.type;
        const eventData = payload.data || payload;

        if (eventName && listeners[eventName]) {
          listeners[eventName].forEach((cb) => cb(eventData));
        }
      } catch {
        // Ignora dados que não sejam JSON válidos
      }
    };

    ws.onclose = () => {
      console.log('❌ [MSW WebSocket] Desconectado');
      setIsConnected(false);
      setSocket(null);
    };

    return () => {
      ws.close();
    };
  }, []);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocket = () => useContext(SocketContext);