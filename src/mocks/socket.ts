import { ws } from 'msw';

const chat = ws.link('ws://localhost:5173/ws');

export const socketHandler = chat.addEventListener('connection', ({ client }) => {
  console.log('⚡ [MSW WebSocket Server] Cliente conectado com sucesso!');

  // Simulação contínua do nft.updated
  const interval = setInterval(() => {
    client.send(
      JSON.stringify({
        event: 'nft.updated',
        data: {
          id: '1',
          price: (Math.random() * 5 + 10).toFixed(2),
          updatedAt: new Date().toISOString(),
        },
      })
    );
  }, 5000);

  // Ouve eventos enviados pelo cliente para simular status de pedidos
  client.addEventListener('message', (event) => {
    try {
      const payload = JSON.parse(event.data.toString());
      
      if (payload.event === 'order.checkout') {
        const orderId = payload.data?.orderId || 'ORD-' + Date.now();
        
        // Simula o fluxo de processamento: Pendente -> Confirmado após 3 segundos
        setTimeout(() => {
          client.send(
            JSON.stringify({
              event: 'order.updated',
              data: {
                orderId,
                status: 'CONFIRMED', // ou 'REJECTED'
                updatedAt: new Date().toISOString(),
              },
            })
          );
        }, 3000);
      }
    } catch {
      // Ignora payload inválido
    }
  });

  client.addEventListener('close', () => {
    console.log('⚡ [MSW WebSocket Server] Cliente desconectado');
    clearInterval(interval);
  });
});