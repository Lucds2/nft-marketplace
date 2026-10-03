import { useState } from 'react';
import img009 from '../assets/009.webp';

interface FilterSidebarProps {
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  priceRange: number;
  onPriceChange: (price: number) => void;
  selectedNetwork: string;
  onNetworkChange: (network: string) => void;
}

export function FilterSidebar({
  selectedCategory,
  onSelectCategory,
  priceRange,
  onPriceChange,
  selectedNetwork,
  onNetworkChange,
}: FilterSidebarProps) {
  const [localPrice, setLocalPrice] = useState<number>(priceRange);
  const [prevPriceProp, setPrevPriceProp] = useState<number>(priceRange);

  // Sincroniza o estado local caso a prop priceRange mude via URL/navegação
  if (priceRange !== prevPriceProp) {
    setPrevPriceProp(priceRange);
    setLocalPrice(priceRange);
  }

  const categories = [
    { name: 'Arte digital', count: 33 },
    { name: 'Fotografia', count: 12 },
    { name: 'Música', count: 65 },
    { name: 'Arte 3D', count: 39 },
    { name: 'Colecionáveis', count: 23 },
    { name: 'Generativa', count: 17 },
    { name: 'Jogos', count: 19 },
    { name: 'Assinaturas', count: 13 },
    { name: 'Utilidade', count: 18 },
  ];

  const networks = [
    { name: 'Ethereum', count: 119 },
    { name: 'Polygon', count: 78 },
    { name: 'Solana', count: 86 },
  ];

  return (
    <aside className="w-full flex flex-col gap-6 font-mono text-xs">
      {/* 1. FILTROS PRINCIPAIS */}
      <div className="bg-[#1F140E] border border-[#2A1C16] rounded-2xl p-6 flex flex-col justify-between min-h-222">
        {/* Coleções */}
        <div className="space-y-3.5">
          <h3 className="text-[#F5F1EB] font-bold text-sm tracking-wide">
            Coleções
          </h3>
          <ul className="space-y-2.5">
            {categories.map((cat) => {
              const isActive = selectedCategory === cat.name;
              return (
                <li key={cat.name}>
                  <button
                    type="button"
                    onClick={() => onSelectCategory(isActive ? '' : cat.name)}
                    className={`w-full text-left flex items-center justify-between text-xs transition-colors ${
                      isActive
                        ? 'text-[#E89B55] font-bold'
                        : 'text-[#CFB28C]/80 hover:text-white'
                    }`}
                  >
                    <span>{cat.name}</span>
                    <span className="text-[#CFB28C]/50">({cat.count})</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Faixa de preço */}
        <div className="space-y-3 pt-2 border-t border-[#2A1C16]/40">
          <h3 className="text-[#F5F1EB] font-bold text-sm tracking-wide">
            Faixa de preço
          </h3>
          <div className="space-y-2.5">
            <input
              type="range"
              aria-label="Filtrar por faixa de preço"
              min="0.02"
              max="12.30"
              step="0.1"
              value={localPrice}
              onChange={(e) => setLocalPrice(Number(e.target.value))}
              className="w-full accent-[#E89B55] bg-[#100D0A] cursor-pointer"
            />
            <p className="text-[#CFB28C]/70 text-[11px]">
              Preço: 0,02 - {localPrice.toFixed(2)} ETH
            </p>
          </div>
          <button
            type="button"
            onClick={() => onPriceChange(localPrice)}
            className="bg-[#E89B55] hover:bg-[#d28a4c] text-[#100D0A] font-bold px-4 py-1.5 rounded-md transition-colors text-xs"
          >
            Aplicar
          </button>
        </div>

        {/* Rede */}
        <div className="space-y-3 pt-2 border-t border-[#2A1C16]/40">
          <h3 className="text-[#F5F1EB] font-bold text-sm tracking-wide">
            Rede
          </h3>
          <ul className="space-y-2.5">
            {networks.map((net) => {
              const isActive = selectedNetwork === net.name;
              return (
                <li key={net.name}>
                  <button
                    type="button"
                    onClick={() => onNetworkChange(isActive ? '' : net.name)}
                    className={`w-full text-left flex items-center justify-between text-xs transition-colors ${
                      isActive
                        ? 'text-[#E89B55] font-bold'
                        : 'text-[#CFB28C]/80 hover:text-white'
                    }`}
                  >
                    <span>{net.name}</span>
                    <span className="text-[#CFB28C]/50">({net.count})</span>
                  </button>
                </li>
              );
            })}
          </ul>
        </div>
      </div>

      {/* 2. CARD DESTAQUE */}
      <div className="bg-[#1F140E] border border-[#2A1C16] rounded-2xl pt-4 overflow-hidden flex flex-col justify-between h-100">
        <div className="space-y-1 text-center px-3 shrink-0 mb-3">
          <h4 className="text-[#E89B55] font-bold text-2xl leading-8 tracking-wider uppercase">
            NFT EM DESTAQUE
          </h4>
          <p className="text-[#F5F1EB] font-bold text-2xl leading-8 tracking-wider uppercase">
            OFERTA LIMITADA
          </p>
        </div>

        <div className="w-full flex-1 overflow-hidden bg-[#100D0A] rounded-b-2xl relative">
          <img
            src={img009}
            alt="Sage Nomad #009 - NFT em Destaque"
            className="w-full h-full object-cover object-top"
          />
        </div>
      </div>
    </aside>
  );
}