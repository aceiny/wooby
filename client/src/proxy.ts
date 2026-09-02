/**
 * Main Proxy (Middleware) Configuration
 *
 * Chains multiple middleware functions together.
 * Each middleware is a factory that wraps the next middleware in the chain.
 */

import { chain } from '@/middlewares/chain';
import { withAuthGuardMiddleware } from '@/middlewares/auth-guard.middleware';
import { withSkipStaticMiddleware } from './middlewares/skip-static.middleware';

export default chain([
  withSkipStaticMiddleware,
  withAuthGuardMiddleware,
]);

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|css|js)$).*)',
  ],
};
