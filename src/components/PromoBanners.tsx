import img042 from '../assets/042.webp';
import img552 from '../assets/552.webp';


export function PromoBanners() {
  return (
    <section className="w-full max-w-7xl mx-auto py-8 px-4 grid grid-cols-1 md:grid-cols-2 gap-6">
      
      {/* Banner 1: Lançamentos Gênesis */}
      <div className="bg-[#1F140E] border border-[#2A1C16] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 group hover:border-[#D28A4C]/40 transition-colors">
        <div className="w-full sm:w-44 aspect-square rounded-xl overflow-hidden shrink-0 bg-[#100D0A]">
          <img
            src={img042}
            alt="Lançamentos gênesis"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between items-center sm:items-end text-center sm:text-right space-y-3">
          <div className="space-y-2">
            <h3 className="text-white font-bold text-base sm:text-lg leading-snug">
              Lançamentos gênesis de edição limitada
            </h3>
            <p className="text-[#A39A91] text-xs leading-relaxed">
              Colecione edições escassas diretamente dos criadores antes da revelação pública.
            </p>
          </div>

          <button className="bg-[#D28A4C] hover:bg-[#b8763d] text-[#100D0A] font-bold text-xs px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5 mt-2">
            Explorar <span>→</span>
          </button>
        </div>
      </div>

      {/* Banner 2: Arte Digital Selecionada */}
      <div className="bg-[#1F140E] border border-[#2A1C16] rounded-2xl p-5 flex flex-col sm:flex-row items-center gap-6 group hover:border-[#D28A4C]/40 transition-colors">
        <div className="w-full sm:w-44 aspect-square rounded-xl overflow-hidden shrink-0 bg-[#100D0A]">
          <img
            src={img552}
            alt="Arte digital selecionada"
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>

        <div className="flex-1 flex flex-col justify-between items-center sm:items-end text-center sm:text-right space-y-3">
          <div className="space-y-2">
            <h3 className="text-white font-bold text-base sm:text-lg leading-snug">
              Arte digital selecionada e muito mais
            </h3>
            <p className="text-[#A39A91] text-xs leading-relaxed">
              Explore novos artistas, coleções verificadas e obras digitais que definem a cultura.
            </p>
          </div>

          <button className="bg-[#D28A4C] hover:bg-[#b8763d] text-[#100D0A] font-bold text-xs px-5 py-2 rounded-lg transition-colors flex items-center gap-1.5 mt-2">
            Explorar <span>→</span>
          </button>
        </div>
      </div>

    </section>
  );
}