import heroImage from '../assets/042.webp'; // ou o caminho da sua imagem local

export function Hero() {
    return (
        <section className="bg-[#1B110B] border border-[#2A1C16] rounded-3xl p-6 lg:p-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            {/* Texto do Hero */}
            <div className="lg:col-span-7 space-y-6">
                <span className="text-[#CFB28C] text-xs font-semibold tracking-wider uppercase">
                    Bem-vindo à Kurio
                </span>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white leading-tight uppercase tracking-tight">
                    SEJA DONO DO FUTURO <br className="hidden sm:inline" />
                    DA ARTE DIGITAL
                </h1>
                <p className="text-[#CFB28C]/80 text-sm sm:text-base max-w-lg leading-relaxed">
                    Descubra NFTs selecionados de criadores emergentes e consagrados. Colecione arte digital rara, única, e faça parte do ecossistema.
                </p>
                <div>
                    <button className="px-6 py-3 bg-[#E89B55] hover:bg-[#d88a44] text-[#120A06] font-bold text-sm rounded-xl transition-all shadow-md">
                        EXPLORAR
                    </button>
                </div>
            </div>

            {/* Imagem Destaque usando heroImage */}
            <div className="lg:col-span-5 flex justify-center lg:justify-end">
                <div className="relative w-full max-w-md aspect-square rounded-2xl overflow-hidden border border-[#2A1C16]">
                    <img
                        src={heroImage}
                        alt="NFT Destaque"
                        className="w-full h-full object-cover"
                        fetchPriority="high"
                        loading="eager"
                    />
                </div>
            </div>
        </section>
    );
}