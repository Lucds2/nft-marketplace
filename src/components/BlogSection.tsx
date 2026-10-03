import img042 from '../assets/042.webp';
import img009 from '../assets/009.webp';
import img207 from '../assets/207.webp';
import img552 from '../assets/552.webp';


const articles = [
  {
    id: '1',
    date: '12 de setembro | Leitura de 6 min',
    title: 'Como funciona a propriedade de NFTs',
    description: 'Aprenda a colecionar, negociar e verificar ativos digitais.',
    image: img552,
  },
  {
    id: '2',
    date: '13 de setembro | Leitura de 2 min',
    title: '10 artistas digitais para acompanhar',
    description: 'Conheça criadores que moldam a cultura digital.',
    image: img042,
  },
  {
    id: '3',
    date: '15 de setembro | Leitura de 3 min',
    title: 'Raridade, atributos e procedência',
    description: 'Entenda raridade, procedência, direitos autorais e utilidade.',
    image: img009,
  },
  {
    id: '4',
    date: '15 de setembro | Leitura de 2 min',
    title: 'Como proteger sua carteira',
    description: 'Proteja sua carteira, seus ativos e sua identidade.',
    image: img207,
  },
];

export function BlogSection() {
  return (
    <section className="w-full max-w-7xl mx-auto py-12 px-4 space-y-8">
      {/* Cabeçalho da Seção */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <h2 className="text-[#F5F1EB] font-mono font-bold text-2xl sm:text-[28px] leading-tight text-center">
          Diário da Cunhagem
        </h2>

        <p className="text-[#CFB28C] font-mono font-normal text-sm leading-tight text-center">
          Histórias, guias e insights para colecionadores sobre o universo da propriedade digital.
        </p>
      </div>

      {/* Grid de 4 Cards de Artigos */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {articles.map((article) => (
          <article
            key={article.id}
            className="bg-[#1F140E] border border-[#2A1C16] rounded-2xl overflow-hidden flex flex-col justify-between group hover:border-[#E89B55]/40 transition-colors"
          >
            {/* Imagem de Capa */}
            <div className="w-full aspect-square overflow-hidden bg-[#100D0A]">
              <img
                src={article.image}
                alt={article.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>

            {/* Conteúdo do Artigo */}
            <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
              <div className="space-y-1.5">
                {/* Data e Tempo de Leitura: 12px / leading-4 */}
                <span className="text-[#CFB28C] font-medium text-xs leading-4 block">
                  {article.date}
                </span>

                {/* Título do Artigo: 16px / leading-tight */}
                <h3 className="text-[#F5F1EB] font-bold text-base leading-tight group-hover:text-[#E89B55] transition-colors">
                  {article.title}
                </h3>

                {/* Descrição: 12px / leading-4 */}
                <p className="text-[#CFB28C] font-medium text-xs leading-4 line-clamp-2">
                  {article.description}
                </p>
              </div>

              {/* Link Ler mais: 12px / leading-3.5 */}
              <a
                href="#"
                className="text-[#E89B55] font-bold text-xs leading-3.5 flex items-center gap-1 hover:underline pt-1"
              >
                Ler mais <span className="text-[10px]">→</span>
              </a>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}