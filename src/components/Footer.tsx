export function Footer() {
  return (
    <footer className="w-full max-w-7xl mx-auto py-8 px-4 font-mono text-xs">
      {/* CARD PRINCIPAL UNIFICADO DO FIGMA */}
      <div className="bg-[#1F140E] border border-[#2A1C16] rounded-2xl overflow-hidden shadow-2xl">
        
        {/* 1. SECÇÃO SUPERIOR: DIFERENCIAIS + NEWSLETTER */}
        <div className="p-6 sm:p-8 grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* 3 Colunas de Diferenciais */}
          <div className="lg:col-span-8 grid grid-cols-1 md:grid-cols-3 gap-6 border-b lg:border-b-0 lg:border-r border-[#2A1C16] pb-8 lg:pb-0 lg:pr-8">
            
            {/* Diferencial 1 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#E89B55] text-[#100D0A] font-bold text-sm flex items-center justify-center">
                W
              </div>
              <div className="space-y-2">
                <h3 className="text-[#F5F1EB] font-bold text-base leading-tight">
                  Segurança da carteira
                </h3>
                <p className="text-[#CFB28C] text-xs leading-relaxed">
                  Proteja sua carteira e colecione arte digital verificada com confiança.
                </p>
              </div>
            </div>

            {/* Diferencial 2 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#E89B55] text-[#100D0A] font-bold text-sm flex items-center justify-center">
                C
              </div>
              <div className="space-y-2">
                <h3 className="text-[#F5F1EB] font-bold text-base leading-tight">
                  Criadores em destaque
                </h3>
                <p className="text-[#CFB28C] text-xs leading-relaxed">
                  Conheça artistas, estúdios e comunidades que moldam a cultura digital na rede.
                </p>
              </div>
            </div>

            {/* Diferencial 3 */}
            <div className="space-y-4">
              <div className="w-10 h-10 rounded-full bg-[#E89B55] text-[#100D0A] font-bold text-sm flex items-center justify-center">
                D
              </div>
              <div className="space-y-2">
                <h3 className="text-[#F5F1EB] font-bold text-base leading-tight">
                  Alertas de lançamentos
                </h3>
                <p className="text-[#CFB28C] text-xs leading-relaxed">
                  Receba calendários de cunhagem, novidades de listas de acesso e análises do mercado.
                </p>
              </div>
            </div>

          </div>

          {/* Bloco de Newsletter */}
          <div className="lg:col-span-4 space-y-3">
            <h3 className="text-[#F5F1EB] font-bold text-base leading-tight">
              Antecipe-se ao próximo lançamento
            </h3>

            {/* Input Newsletter: 325px x 40px, bg-[#38220F], rounded-[6px] */}
            <form
              onSubmit={(e) => e.preventDefault()}
              className="w-full max-w-81.25 h-10 bg-[#38220F] rounded-md pl-3 pr-1 flex items-center justify-between overflow-hidden"
            >
              <input
                type="email"
                placeholder="digite seu e-mail..."
                className="bg-transparent text-xs text-white placeholder-[#CFB28C]/60 focus:outline-none w-full"
              />
              <button
                type="submit"
                className="bg-[#E89B55] hover:bg-[#d28a4c] text-[#100D0A] font-bold text-xs h-8 px-4 rounded transition-colors shrink-0"
              >
                Enviar
              </button>
            </form>

            <p className="text-[#CFB28C] text-xs leading-4 pt-1">
              Receba lançamentos selecionados, histórias de criadores e novidades do mercado.
            </p>
          </div>

        </div>

        {/* 2. FAIXA CENTRAL: CONTACTOS / BARRA CURIO */}
        <div className="bg-[#38220F]/40 border-y border-[#2A1C16] px-6 sm:px-8 py-4 flex flex-col md:flex-row items-center justify-between gap-4 text-center md:text-left text-[#CFB28C]">
          <span className="text-[#F5F1EB] font-bold text-base tracking-wider">
            KURIO
          </span>
          <p>
            Feito para colecionadores, criadores e cultura
          </p>
          <div className="flex flex-col sm:flex-row items-center gap-4">
            <a href="mailto:contato@email.com" className="hover:text-white transition-colors">
              contato@email.com
            </a>
            <span className="hidden sm:inline text-[#2A1C16]">•</span>
            <a href="tel:+551140028922" className="hover:text-white transition-colors">
              +55 11 4002 8922
            </a>
          </div>
        </div>

        {/* 3. SECÇÃO INFERIOR: COLUNAS DE LINKS */}
        <div className="p-6 sm:p-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
          
          {/* Coluna 1: Meu perfil */}
          <div className="space-y-3">
            <h4 className="text-[#F5F1EB] font-bold text-sm">Meu perfil</h4>
            <ul className="space-y-2 text-[#CFB28C]">
              <li><a href="#" className="hover:text-white transition-colors">Meu perfil</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Minha coleção</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Atividade</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Estúdio do criador</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Lista de interesse</a></li>
            </ul>
          </div>

          {/* Coluna 2: Central de ajuda */}
          <div className="space-y-3">
            <h4 className="text-[#F5F1EB] font-bold text-sm">Central de ajuda</h4>
            <ul className="space-y-2 text-[#CFB28C]">
              <li><a href="#" className="hover:text-white transition-colors">Central de ajuda</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Como comprar NFTs</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Carteira e segurança</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Política do mercado</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Denunciar item</a></li>
            </ul>
          </div>

          {/* Coluna 3: Coleções */}
          <div className="space-y-3">
            <h4 className="text-[#F5F1EB] font-bold text-sm">Coleções</h4>
            <ul className="space-y-2 text-[#CFB28C]">
              <li><a href="#" className="hover:text-white transition-colors">Arte digital</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Fotografia</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Música</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Arte 3D</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Utilidade</a></li>
            </ul>
          </div>

          {/* Coluna 4: Redes sociais (Com ícones SVG reais) e Carteiras */}
          <div className="space-y-6">
            <div className="space-y-3">
              <h4 className="text-[#F5F1EB] font-bold text-sm">Redes sociais</h4>
              <div className="flex items-center gap-2">
                {/* Facebook */}
                <a
                  href="#"
                  aria-label="Facebook"
                  className="w-8 h-8 rounded border border-[#2A1C16] bg-[#38220F]/30 flex items-center justify-center text-[#CFB28C] hover:text-white hover:border-[#E89B55] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                  </svg>
                </a>

                {/* Instagram */}
                <a
                  href="#"
                  aria-label="Instagram"
                  className="w-8 h-8 rounded border border-[#2A1C16] bg-[#38220F]/30 flex items-center justify-center text-[#CFB28C] hover:text-white hover:border-[#E89B55] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
                  </svg>
                </a>

                {/* X / Twitter */}
                <a
                  href="#"
                  aria-label="X (Twitter)"
                  className="w-8 h-8 rounded border border-[#2A1C16] bg-[#38220F]/30 flex items-center justify-center text-[#CFB28C] hover:text-white hover:border-[#E89B55] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                  </svg>
                </a>

                {/* LinkedIn */}
                <a
                  href="#"
                  aria-label="LinkedIn"
                  className="w-8 h-8 rounded border border-[#2A1C16] bg-[#38220F]/30 flex items-center justify-center text-[#CFB28C] hover:text-white hover:border-[#E89B55] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                  </svg>
                </a>

                {/* YouTube */}
                <a
                  href="#"
                  aria-label="YouTube"
                  className="w-8 h-8 rounded border border-[#2A1C16] bg-[#38220F]/30 flex items-center justify-center text-[#CFB28C] hover:text-white hover:border-[#E89B55] transition-colors"
                >
                  <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>

            <div className="space-y-3">
              <h4 className="text-[#F5F1EB] font-bold text-sm">Carteiras compatíveis</h4>
              <div className="bg-[#38220F]/40 border border-[#2A1C16] rounded-lg p-2 text-[10px] text-[#E89B55] font-bold flex items-center justify-between gap-1">
                <span>METAMASK</span>
                <span>•</span>
                <span>WALLETCONNECT</span>
                <span>•</span>
                <span>COINBASE</span>
              </div>
            </div>
          </div>

        </div>

      </div>

      {/* COPYRIGHT EXTERNO */}
      <div className="pt-6 text-center text-xs text-[#CFB28C]">
        © 2026 Kurio. Propriedade digital para todos.
      </div>
    </footer>
  );
}