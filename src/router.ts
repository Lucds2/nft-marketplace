import { createRouter } from '@tanstack/react-router';
import { rootRoute } from './routes/__root';
import { indexRoute } from './routes/index';
import { cartRoute } from './routes/cart';
import { checkoutRoute } from './routes/checkout';
import { nftDetailRoute } from './routes/nft.$id';
import { orderConfirmationRoute } from './routes/order-confirmation';
import { profileRoute } from './routes/profile';
import { walletsRoute } from './routes/wallets';

const routeTree = rootRoute.addChildren([
  indexRoute,
  cartRoute,
  checkoutRoute,
  nftDetailRoute,
  orderConfirmationRoute,
  profileRoute,
  walletsRoute,
]);

export const router = createRouter({ routeTree });