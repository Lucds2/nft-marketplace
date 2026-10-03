import { http, HttpResponse, } from 'msw';
import * as dataModule from './data';

// Tenta importar a lista de NFTs de data.ts suportando diferentes nomes exportados
const rawNfts =
  (dataModule as Record<string, unknown>).initialNfts ||
  (dataModule as Record<string, unknown>).nfts ||
  (dataModule as Record<string, unknown>).default ||
  [];

// Se a lista estiver vazia ou mal formatada, garante um fallback
const nftsData = Array.isArray(rawNfts) ? rawNfts : [];

interface Wallet {
  id: string;
  address: string;
  network: string;
  isPrimary?: boolean;
}

interface User {
  id: string | number;
  name: string;
  email: string;
  password?: string;
  avatar?: string;
  wallets?: Wallet[];
}

interface OrderRequestBody {
  items: unknown[];
  totalEth: string;
}

interface OrderResponse {
  id: string;
  items: unknown[];
  totalEth: string;
  status: string;
  createdAt: string;
}

// Map fortemente tipado com a interface do pedido
const processedIdempotencyKeys = new Map<string, OrderResponse>();

export const orderHandlers = [
  http.post('/api/orders', async ({ request }) => {
    const idempotencyKey = request.headers.get('x-idempotency-key');

    if (!idempotencyKey) {
      return HttpResponse.json(
        { message: 'Cabeçalho X-Idempotency-Key é obrigatório.' },
        { status: 400 }
      );
    }

    const cachedOrder = processedIdempotencyKeys.get(idempotencyKey);
    if (cachedOrder) {
      console.warn(`⚠️ [MSW] Requisição duplicada detectada! Chave: ${idempotencyKey}`);
      return HttpResponse.json(cachedOrder, {
        status: 200,
        headers: { 'X-Cache-Hit': 'true' },
      });
    }

    const body = (await request.json()) as OrderRequestBody;
    
    const newOrder: OrderResponse = {
      id: `ORD-${Math.floor(100000 + Math.random() * 900000)}`,
      items: body.items,
      totalEth: body.totalEth,
      status: 'PENDING',
      createdAt: new Date().toISOString(),
    };

    processedIdempotencyKeys.set(idempotencyKey, newOrder);

    return HttpResponse.json(newOrder, { status: 201 });
  }),
];

const STORAGE_KEY = 'nft_marketplace_users';

const getStoredUsers = (): User[] => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) {
    try {
      return JSON.parse(data);
    } catch {
      // Ignora erro de parsing
    }
  }
  return [
    {
      id: '1',
      name: 'Luciano dos Santos',
      email: 'luciano@exemplo.com',
      password: '123',
      avatar: 'https://github.com/github.png',
      wallets: [
        {
          id: 'w1',
          address: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          network: 'Ethereum',
          isPrimary: true,
        },
      ],
    },
  ];
};

const saveUsers = (users: User[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
};

let users = getStoredUsers();

// --- HANDLERS AUXILIARES ---

const handleRegister = async (request: Request) => {
  const { name, email, password } = (await request.json()) as {
    name?: string;
    email?: string;
    password?: string;
  };

  if (!name || !email || !password) {
    return new HttpResponse(
      JSON.stringify({ message: 'Preencha todos os campos obrigatórios.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  users = getStoredUsers();

  const userExists = users.some((u) => u.email === email);
  if (userExists) {
    return new HttpResponse(
      JSON.stringify({ message: 'Este e-mail já está cadastrado.' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const newUser: User = {
    id: String(Date.now()),
    name,
    email,
    password,
    avatar: '',
    wallets: [],
  };

  users.push(newUser);
  saveUsers(users);

  const token = `mock-jwt-token-${newUser.id}`;

  return HttpResponse.json(
    {
      user: {
        id: newUser.id,
        name: newUser.name,
        email: newUser.email,
        avatar: newUser.avatar,
        wallets: newUser.wallets,
      },
      token,
    },
    { status: 201 }
  );
};

const handleAddWallet = async (request: Request) => {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new HttpResponse(JSON.stringify({ message: 'Não autorizado.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const userId = token.replace('mock-jwt-token-', '');

  users = getStoredUsers();
  const user = users.find((u) => String(u.id) === userId);

  if (!user) {
    return new HttpResponse(
      JSON.stringify({ message: 'Utilizador não encontrado.' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const body = (await request.json()) as {
    address: string;
    network: string;
    isPrimary?: boolean;
  };

  if (!user.wallets) user.wallets = [];

  if (body.isPrimary) {
    user.wallets.forEach((w) => {
      w.isPrimary = false;
    });
  }

  const newWallet: Wallet = {
    id: `w_${Date.now()}`,
    address: body.address,
    network: body.network,
    isPrimary: body.isPrimary || user.wallets.length === 0,
  };

  user.wallets.push(newWallet);
  saveUsers(users);

  return HttpResponse.json(user.wallets, { status: 201 });
};

const handleUpdateWallet = async (request: Request, walletId: string) => {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new HttpResponse(JSON.stringify({ message: 'Não autorizado.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const userId = token.replace('mock-jwt-token-', '');

  users = getStoredUsers();
  const user = users.find((u) => String(u.id) === userId);

  if (!user || !user.wallets) {
    return new HttpResponse(
      JSON.stringify({ message: 'Carteira não encontrada.' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const walletIndex = user.wallets.findIndex((w) => w.id === walletId);
  if (walletIndex === -1) {
    return new HttpResponse(
      JSON.stringify({ message: 'Carteira não encontrada.' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  const body = (await request.json()) as {
    address?: string;
    network?: string;
    isPrimary?: boolean;
  };

  if (body.isPrimary) {
    user.wallets.forEach((w) => {
      w.isPrimary = false;
    });
  }

  if (body.address) user.wallets[walletIndex].address = body.address;
  if (body.network) user.wallets[walletIndex].network = body.network;
  if (body.isPrimary !== undefined)
    user.wallets[walletIndex].isPrimary = body.isPrimary;

  saveUsers(users);

  return HttpResponse.json(user.wallets);
};

const handleDeleteWallet = (request: Request, walletId: string) => {
  const authHeader = request.headers.get('Authorization');

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return new HttpResponse(JSON.stringify({ message: 'Não autorizado.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const token = authHeader.replace('Bearer ', '');
  const userId = token.replace('mock-jwt-token-', '');

  users = getStoredUsers();
  const user = users.find((u) => String(u.id) === userId);

  if (!user || !user.wallets) {
    return new HttpResponse(
      JSON.stringify({ message: 'Carteira não encontrada.' }),
      { status: 404, headers: { 'Content-Type': 'application/json' } }
    );
  }

  user.wallets = user.wallets.filter((w) => w.id !== walletId);

  if (user.wallets.length > 0 && !user.wallets.some((w) => w.isPrimary)) {
    user.wallets[0].isPrimary = true;
  }

  saveUsers(users);

  return HttpResponse.json(user.wallets);
};

// --- HANDLERS PRINCIPAIS ---

export const handlers = [
    ...orderHandlers,
    http.get('*/socket.io/', () => {
    return HttpResponse.text('0{"sid":"msw-mock-sid","upgrades":["websocket"],"pingInterval":25000,"pingTimeout":20000}');
  }),
    http.get('https://via.placeholder.com/*', () => {
  // Retorna um SVG simples como imagem de avatar/placeholder
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
    <rect width="40" height="40" fill="#333333"/>
    <text x="50%" y="50%" dominant-baseline="middle" text-anchor="middle" fill="#ffffff" font-size="12">40x40</text>
  </svg>`;

  return new HttpResponse(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
    },
  });
}),
  // CATÁLOGO DE NFTS
  http.get('/nfts', () => HttpResponse.json(nftsData)),
  http.get('/api/nfts', () => HttpResponse.json(nftsData)),
  http.get('/nfts/:id', ({ params }) => {
    const { id } = params;
    const nft = nftsData.find(
      (item: Record<string, unknown>) => String(item.id) === String(id)
    );
    return nft ? HttpResponse.json(nft) : new HttpResponse(null, { status: 404 });
  }),
  http.get('/api/nfts/:id', ({ params }) => {
    const { id } = params;
    const nft = nftsData.find(
      (item: Record<string, unknown>) => String(item.id) === String(id)
    );
    return nft ? HttpResponse.json(nft) : new HttpResponse(null, { status: 404 });
  }),

 // AUTH: REGISTRO / CADASTRO
  http.post('/auth/register', ({ request }) => handleRegister(request)),
  http.post('/api/auth/register', ({ request }) => handleRegister(request)),
  http.post('/users', ({ request }) => handleRegister(request)),
  http.post('/api/users', ({ request }) => handleRegister(request)),

 // AUTH: LOGIN
  http.post('/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };
    users = getStoredUsers();

    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return new HttpResponse(
        JSON.stringify({ message: 'Credenciais inválidas.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const token = `mock-jwt-token-${user.id}`;
    return HttpResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        wallets: user.wallets || [],
      },
      token,
    });
  }),
  http.post('/api/auth/login', async ({ request }) => {
    const { email, password } = (await request.json()) as {
      email?: string;
      password?: string;
    };
    users = getStoredUsers();

    const user = users.find((u) => u.email === email && u.password === password);

    if (!user) {
      return new HttpResponse(
        JSON.stringify({ message: 'Credenciais inválidas.' }),
        {
          status: 401,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const token = `mock-jwt-token-${user.id}`;
    return HttpResponse.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        wallets: user.wallets || [],
      },
      token,
    });
  }),

  // AUTH: ME
  http.get('/auth/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(JSON.stringify({ message: 'Não autorizado.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-jwt-token-', '');

    users = getStoredUsers();
    const user = users.find((u) => String(u.id) === userId);

    if (!user) {
      return new HttpResponse(JSON.stringify({ message: 'Sessão inválida.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return HttpResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      wallets: user.wallets || [],
    });
  }),
  http.get('/api/auth/me', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(JSON.stringify({ message: 'Não autorizado.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-jwt-token-', '');

    users = getStoredUsers();
    const user = users.find((u) => String(u.id) === userId);

    if (!user) {
      return new HttpResponse(JSON.stringify({ message: 'Sessão inválida.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    return HttpResponse.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      wallets: user.wallets || [],
    });
  }),

  // USUÁRIOS: EDITAR PERFIL
  http.put('/users/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(JSON.stringify({ message: 'Não autorizado.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-jwt-token-', '');

    users = getStoredUsers();
    const userIndex = users.findIndex((u) => String(u.id) === userId);

    if (userIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Utilizador não encontrado.' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = (await request.json()) as {
      name?: string;
      avatar?: string;
      password?: string;
    };

    if (body.name) users[userIndex].name = body.name;
    if (body.avatar !== undefined) users[userIndex].avatar = body.avatar;
    if (body.password) users[userIndex].password = body.password;

    saveUsers(users);

    const updatedUser = users[userIndex];
    return HttpResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      wallets: updatedUser.wallets || [],
    });
  }),
  http.put('/api/users/profile', async ({ request }) => {
    const authHeader = request.headers.get('Authorization');

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return new HttpResponse(JSON.stringify({ message: 'Não autorizado.' }), {
        status: 401,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    const token = authHeader.replace('Bearer ', '');
    const userId = token.replace('mock-jwt-token-', '');

    users = getStoredUsers();
    const userIndex = users.findIndex((u) => String(u.id) === userId);

    if (userIndex === -1) {
      return new HttpResponse(
        JSON.stringify({ message: 'Utilizador não encontrado.' }),
        {
          status: 404,
          headers: { 'Content-Type': 'application/json' },
        }
      );
    }

    const body = (await request.json()) as {
      name?: string;
      avatar?: string;
      password?: string;
    };

    if (body.name) users[userIndex].name = body.name;
    if (body.avatar !== undefined) users[userIndex].avatar = body.avatar;
    if (body.password) users[userIndex].password = body.password;

    saveUsers(users);

    const updatedUser = users[userIndex];
    return HttpResponse.json({
      id: updatedUser.id,
      name: updatedUser.name,
      email: updatedUser.email,
      avatar: updatedUser.avatar,
      wallets: updatedUser.wallets || [],
    });
  }),
  // CARTEIRAS: ADICIONAR
  http.post('/users/wallets', ({ request }) => handleAddWallet(request)),
  http.post('/api/users/wallets', ({ request }) => handleAddWallet(request)),

  // CARTEIRAS: EDITAR
  http.put('/users/wallets/:id', ({ request, params }) =>
    handleUpdateWallet(request, String(params.id))
  ),
  http.put('/api/users/wallets/:id', ({ request, params }) =>
    handleUpdateWallet(request, String(params.id))
  ),

  // CARTEIRAS: REMOVER
  http.delete('/users/wallets/:id', ({ request, params }) =>
    handleDeleteWallet(request, String(params.id))
  ),
  http.delete('/api/users/wallets/:id', ({ request, params }) =>
    handleDeleteWallet(request, String(params.id))
  ),
];