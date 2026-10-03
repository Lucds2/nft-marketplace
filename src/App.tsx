import { RouterProvider } from '@tanstack/react-router';
import { router } from './router';
import { CartProvider } from './context/CartContext';
import { AuthProvider } from './context/AuthContext';
import { Web3Provider } from './context/Web3Context';
import { SocketProvider } from './context/SocketContext';

export default function App() {
  return (
    <SocketProvider>
      <Web3Provider>
        <AuthProvider>
          <CartProvider>
            <RouterProvider router={router} />
          </CartProvider>
        </AuthProvider>
      </Web3Provider>
    </SocketProvider>
  );
}
  