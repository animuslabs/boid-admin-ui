import { createTRPCProxyClient, httpLink } from '@trpc/client';
import HRouter from './trpcAPIimport';

const mainURL = 'https://powerapi.animus.is/api';

export const trpc = createTRPCProxyClient<HRouter.AppRouter>({
  links: [
    httpLink({
      url: mainURL,
    }),
  ],
});
