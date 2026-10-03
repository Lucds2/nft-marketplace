/* eslint-disable react-refresh/only-export-components */

import { createRoute, useNavigate, useSearch } from '@tanstack/react-router';
import { rootRoute } from './__root';
import { Hero } from '../components/Hero';
import { PromoBanners } from '../components/PromoBanners';
import { NFTFeed } from '../components/NFTFeed';
import { BlogSection } from '../components/BlogSection';

// Tipagem dos parâmetros da URL
export interface NftSearchSchema {
  q?: string;
  category?: string;
  network?: string;
  maxPrice?: number;
  sort?: string;
  page?: number;
}

export const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  validateSearch: (search: Record<string, unknown>): NftSearchSchema => {
    return {
      q: typeof search.q === 'string' ? search.q : '',
      category: typeof search.category === 'string' ? search.category : '',
      network: typeof search.network === 'string' ? search.network : '',
      maxPrice: search.maxPrice ? Number(search.maxPrice) : 12.3,
      sort: typeof search.sort === 'string' ? search.sort : 'recent',
      page: search.page ? Number(search.page) : 1,
    };
  },
  component: IndexPage,
});

function IndexPage() {
  const search = useSearch({ from: indexRoute.id });
  const navigate = useNavigate({ from: indexRoute.id });

  const updateFilters = (newFilters: Partial<NftSearchSchema>) => {
    navigate({
      search: (prev: NftSearchSchema) => ({
        ...prev,
        ...newFilters,
        page: newFilters.page ?? 1,
      }),
    });
  };

  return (
    <div className="space-y-12">
      <Hero />
      <NFTFeed searchParams={search} onFilterChange={updateFilters} />
      <PromoBanners />
      <BlogSection />
    </div>
  );
}