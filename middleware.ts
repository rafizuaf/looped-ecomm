import { NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';
import { NextRequestWithAuth } from 'next-auth/middleware';

export default async function middleware(req: NextRequestWithAuth) {
  const token = await getToken({ req });
  const isAuthenticated = !!token;
  const isAdminPanel = req.nextUrl.pathname.startsWith('/admin');
  const isAuthPage = 
    req.nextUrl.pathname.startsWith('/sign-in') || 
    req.nextUrl.pathname.startsWith('/sign-up');

  // Redirect unauthenticated users to login
  if (!isAuthenticated && !isAuthPage) {
    return NextResponse.redirect(new URL('/sign-in', req.url));
  }

  // Redirect authenticated users from auth pages to home
  if (isAuthenticated && isAuthPage) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Check admin access
  if (isAuthenticated && isAdminPanel && token.role !== 'SUPERADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*', '/orders/:path*', '/sign-in', '/sign-up'],
};