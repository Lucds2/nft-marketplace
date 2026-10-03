## Política de Sessão e Contratos REST

### Sessão e Autenticação:
A sessão do usuário é gerenciada e persistida através de tokens/cookies simulados pela camada de MSW (`/api/auth/login`, `/api/auth/me`).

O estado é recuperado automaticamente após um refresh (F5) através da rota de verificação de sessão, garantindo que o contexto do utilizador não seja perdido durante a navegação.

Caso a sessão expire durante o fluxo de checkout ou navegação, o estado atual do formulário/carrinho é preservado, permitindo que o utilizador retome exatamente de onde parou após uma nova autenticação.

### Contratos REST Principais:
- **`GET /api/nfts`**: Listagem de NFTs com suporte a parâmetros de busca, filtros combinados (categoria, rede), ordenação e paginação.
- **`POST /api/orders`**: Criação de pedidos com obrigatoriedade de chave de idempotência (`Idempotency-Key`), evitando cobranças ou pedidos duplicados em caso de cliques repetidos ou timeouts de rede.

## Tempo Real com Socket.IO e Reconciliação

### Eventos e Transporte:
- Utiliza-se o `@mswjs/socket.io-binding` para simular o protocolo Socket.IO na camada de mocks.
- **Eventos Principais:** 
  - `nft.updated`: Atualiza em tempo real o preço e a disponibilidade dos NFTs no catálogo, detalhe e carrinho. Caso a cotação mude durante o fluxo de compra, a interface impede o checkout com dados desatualizados.
  - `order.updated`: Atualiza de forma assíncrona o estado do pedido (pendente, confirmado ou recusado).

### Estratégia de Tolerância e Reconexão:
- **Validação de Versão e Identidade:** O cliente valida eventos recebidos para descartar duplicatas ou eventos antigos, prevenindo a regressão para estados obsoletos.
- **Reconciliação Pós-Queda:** Após uma interrupção de conexão e posterior reconexão, a aplicação dispara uma chamada REST para ressincronizar os recursos ativos, garantindo que o utilizador recupere o seu estado correto sem perder dados ou duplicar pedidos.

## Cache, Carrinho e Acessibilidade

### Estratégia de Cache e Estado Remoto:
- **TanStack Query:** Utilizado para gerir o estado remoto, mutations e sincronização de cache. As chaves de cache (`queryKey`) são estritamente isoladas por utilizador e por parâmetros de consulta, prevenindo vazamentos de dados entre contas.
- **Invalidação:** Mutations bem-sucedidas invalidam automaticamente as queries associadas para forçar um refetch imediato e garantir dados consistentes na interface.

### Gestão do Carrinho:
- Os itens do carrinho persistem localmente para suportar o refresh da página (F5).
- Durante o processo de autenticação, o carrinho do visitante é fundido de forma segura com o perfil do colecionador autenticado.

### Acessibilidade e Trade-offs de UX:
- **Acessibilidade:** Implementação de navegação completa por teclado, armadilhas de foco (`focus-trap`) em modais e drawers, atributos `aria-*` dinâmicos e suporte a leitores de tela.
- **Responsividade:** Layouts totalmente adaptados para viewports a partir de 390px (mobile), garantindo que telas complexas como perfil e checkout mantenham a consistência visual em qualquer dispositivo.