import { NextResponse } from 'next/server';
import type { NextFetchEvent, NextRequest } from 'next/server';
import { CustomMiddleware } from './chain';
import { APP_PATHS } from '@/shared/constants/paths';

const PUBLIC_PATHS = [
  APP_PATHS.AUTH.LOGIN,
  APP_PATHS.AUTH.REGISTER,
  APP_PATHS.BASE,
];

function isPublicPath(pathname: string): boolean {
  if (pathname === APP_PATHS.BASE) return true;
  return PUBLIC_PATHS.some(
    (path) => path !== APP_PATHS.BASE && pathname.startsWith(path)
  );
}

function isAuthPath(pathname: string): boolean {
  return pathname.startsWith(APP_PATHS.AUTH.BASE);
}

export function withAuthGuardMiddleware(
  middleware: CustomMiddleware,
): CustomMiddleware {
  return async (
    request: NextRequest,
    event: NextFetchEvent,
    response: NextResponse,
  ) => {
    const token = request.cookies.get('token')?.value;
    const pathname = request.nextUrl.pathname;

    // Authenticated user visiting auth pages → redirect to dashboard
    if (token && isAuthPath(pathname)) {
      return NextResponse.redirect(
        new URL(APP_PATHS.DASHBOARD, request.url)
      );
    }

    // Unauthenticated user visiting protected pages → redirect to login
    if (!token && !isPublicPath(pathname)) {
      const loginUrl = new URL(APP_PATHS.AUTH.LOGIN, request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }

    return middleware(request, event, response);
  };
}
