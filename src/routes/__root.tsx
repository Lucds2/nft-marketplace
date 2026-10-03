import { createRootRoute, Outlet } from '@tanstack/react-router';
import { Header } from '../components/Header';
import { Footer } from '../components/Footer';

export const rootRoute = createRootRoute({
  component: () => (
    <div className="min-h-screen bg-[#120A06] text-white flex flex-col font-sans antialiased">
      <Header />
      <main className="grow max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <Outlet />
      </main>
      <Footer />
    </div>
  ),
});