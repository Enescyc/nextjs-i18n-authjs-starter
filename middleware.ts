import createMiddleware from 'next-intl/middleware';
import { withAuth } from "next-auth/middleware"
import { Role } from "@prisma/client"
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
  function onSuccess(req) {
    return intlMiddleware(req);
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Check for locale-prefixed routes like /en/admin, /tr/admin, etc.
        const isAdminRoute = pathname.match(/^\/(en|tr)\/admin/) || pathname === '/admin'
        const isDashboardRoute = pathname.match(/^\/(en|tr)\/dashboard/) || pathname === '/dashboard'
        
        if (isAdminRoute) {
          return token?.role === Role.ADMIN
        }
        
        if (isDashboardRoute) {
          return !!token
        }
        
        return true
      },
    },
  }
);

export default function middleware(req: any) {
  const { pathname } = req.nextUrl;
  
  // Check for both locale-prefixed and non-prefixed protected routes
  const isProtectedRoute = pathname.match(/^\/(en|tr)?\/?(?:admin|dashboard)/) 
  
  if (isProtectedRoute) {
    return (authMiddleware as any)(req);
  }
  
  return intlMiddleware(req);
}

export const config = {
  matcher: ['/', '/(tr|en)/:path*', '/((?!api|_next|_vercel|.*\\..*).*)']
};