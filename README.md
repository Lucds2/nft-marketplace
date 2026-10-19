# NFT Marketplace — Desafio Frontend

Aplicação web completa desenvolvida em React e TypeScript, que simula um marketplace de NFTs de alta performance. O projeto contempla descoberta, catálogo com filtros avançados sincronizados na URL, carrinho com persistência, gestão de perfil/carteiras, fluxo de checkout com simulação de pagamentos, tempo real via WebSockets (`Socket.IO`) e testes automatizados end-to-end com Playwright.

---

## 🚀 Tecnologias Utilizadas (Stack Obrigatória)

- **Interface:** React & TypeScript
- **Roteamento:** TanStack Router (com sincronização de parâmetros na URL)
- **Estado Remoto & Cache:** TanStack Query
- **Requisições HTTP:** Axios
- **Estilização:** Tailwind CSS & shadcn/ui
- **Mocking de Rede & Tempo Real:** MSW (Mock Service Worker) + `@mswjs/socket.io-binding`
- **Testes E2E & Regressão Visual:** Playwright
- **Qualidade & Performance:** Lighthouse

---

## 🛠️ Pré-requisitos e Instalação

Certifica-te de que tens o **Node.js** (versão 18 ou superior) instalado no teu sistema.

1. **Clona o repositório:**
   ```bash
   git clone <url-do-repositorio>
   cd nft-marketplace


**Instala as dependências:**

Bash
npm install

📦 Comandos de Execução
O projeto dispõe dos seguintes scripts configurados no package.json:

Modo de Desenvolvimento (com MSW ativo):

Bash
npm run dev
Build de Produção otimizado:

Bash
npm run build
Pré-visualização do Build:

Bash
npm run preview
Verificação de Tipos (TypeScript):

Bash
npm run typecheck
Testes E2E com Playwright:

Bash
npm run test:e2e
Modo UI interativo do Playwright:

Bash
npm run test:e2e:ui
🔑 Credenciais Fictícias para Testes
Para testar os fluxos protegidos (como perfil, carteiras, favoritos e checkout):

**Acesse o link: https://nft-marketplace-lucds.vercel.app/**

Criar uma nova conta diretamente através do modal de cadastro.

📋 **Configuração e Simulação de Cenários (MSW)**

A camada de mocks intercepta todas as requisições HTTP e eventos de Socket.IO, permitindo testar cenários de resiliência:

🐢 Lentidão / Latência: Configurável através dos handlers do MSW.

⚠️ Erros de Servidor (4xx/5xx): Tratados de forma elegante com mensagens de feedback na interface.

🛡️ Idempotência: O endpoint POST /api/orders utiliza chaves de idempotência (Idempotency-Key) para evitar cobranças ou pedidos duplicados em caso de timeout ou cliques repetidos.

🏛️ **Documentação Arquitetural**

🔐 Política de Sessão e Contratos REST
A sessão do utilizador é gerenciada e persistida através de tokens e cookies simulados pela camada de MSW através das rotas /api/auth/login e /api/auth/me. O estado é recuperado automaticamente após um refresh (F5) através da rota de verificação de sessão, garantindo que o contexto do utilizador não seja perdido durante a navegação. Caso a sessão expire durante o fluxo de checkout ou navegação, o estado atual do formulário e do carrinho é preservado, permitindo que o utilizador retome exatamente de onde parou após realizar uma nova autenticação.

**Os principais contratos REST contemplam:**

GET /api/nfts: Listagem de NFTs com suporte completo a parâmetros de busca, filtros combinados por categoria e rede, ordenação e paginação.

POST /api/orders: Criação de pedidos exigindo obrigatoriamente uma chave de idempotência (Idempotency-Key), prevenindo cobranças ou registos de pedidos duplicados em cenários de cliques repetidos ou timeouts de rede.

⚡ **Tempo Real com Socket.IO e Reconciliação**

A aplicação utiliza o pacote @mswjs/socket.io-binding para simular o protocolo Socket.IO de forma integrada na camada de mocks. Os eventos principais incluem:

nft.updated: Atualiza em tempo real o preço e a disponibilidade dos NFTs em todo o catálogo, ecrã de detalhes e carrinho. Se a cotação sofrer alterações durante o processo de compra, a interface bloqueia o checkout com dados desatualizados.

order.updated: Atualiza assincronamente o estado do pedido para pendente, confirmado ou recusado.

A estratégia de tolerância a falhas e reconexão baseia-se em:

Validação de versão e identidade: O cliente valida todos os eventos recebidos para descartar duplicatas ou mensagens obsoletas, evitando regressões de estado.

Reconciliação pós-queda: Após uma quebra de conexão e subsequente reconexão, a aplicação executa chamadas REST para ressincronizar os recursos ativos, assegurando que o utilizador recupera o estado correto sem duplicar operações.

🗄️ Cache, Carrinho e Acessibilidade
🧠 Estratégia de Cache e Estado Remoto: O TanStack Query gere o estado remoto, onde as chaves de cache (queryKey) estão estritamente isoladas por utilizador e parâmetros de consulta para impedir fugas de dados entre contas. As mutations bem-sucedidas invalidam automaticamente as queries correspondentes para forçar uma atualização imediata.

🛒 Gestão do Carrinho: Os itens persistem localmente para resistir a refreshes de página, sendo fundidos de forma segura com o perfil do colecionador assim que ocorre a autenticação.

♿ Acessibilidade e Experiência (UX): Foram implementadas a navegação integral por teclado, o controlo de foco (focus-trap) em modais e gavetas, atributos dinâmicos aria-* e uma adaptação fluida para viewports móveis a partir de 390px.
