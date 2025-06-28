import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from "next/server";
import { routing } from '@/lib/i18n/routing';

// Create the internationalization middleware
const intlMiddleware = createMiddleware(routing);

// Define public pages that don't require authentication
const publicPages = [
  '/',
  '/auth/signin',
  '/auth/error',
  '/auth/signout',
  '/about',
  '/contact'
] as const;

// Helper function to normalize pathname by removing locale prefix
function normalizePathname(pathname: string): string {
  // Use routing.locales for dynamic locale detection
  const localePattern = new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`);
  return pathname.replace(localePattern, '') || '/';
}

// Helper function to extract locale from pathname
function extractLocale(pathname: string): string | null {
  const localeMatch = pathname.match(new RegExp(`^/(${routing.locales.join('|')})(?=/|$)`));
  return localeMatch ? localeMatch[1] : null;
}

// Helper function to check if a pathname is public
function isPublicPage(pathname: string): boolean {
  const normalizedPath = normalizePathname(pathname);
  
  return publicPages.some(page => {
    if (page === '/') {
      return normalizedPath === '/';
    }
    return normalizedPath.startsWith(page);
  });
}

// Helper function to check if a route requires authentication
function isProtectedRoute(pathname: string): boolean {
  const normalizedPath = normalizePathname(pathname);
  return normalizedPath.startsWith('/dashboard') || normalizedPath.startsWith('/admin');
}

// Add security headers helper
function addSecurityHeaders(response: NextResponse): NextResponse {
  // Add security headers following 2024 best practices
  response.headers.set('X-Content-Type-Options', 'nosniff');
  response.headers.set('X-Frame-Options', 'DENY');
  response.headers.set('Referrer-Policy', 'strict-origin-when-cross-origin');
  response.headers.set('X-DNS-Prefetch-Control', 'off');
  
  return response;
}

export default function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;
  
  try {
    // Enhanced static file detection with better performance
    if (
      pathname.startsWith('/api/') ||
      pathname.startsWith('/_next/') ||
      pathname.startsWith('/_vercel/') ||
      pathname.startsWith('/favicon') ||
      pathname.startsWith('/robots') ||
      pathname.startsWith('/sitemap') ||
      pathname.startsWith('/manifest') ||
      // More specific file extension check
      /\.(ico|png|jpg|jpeg|svg|gif|webp|js|css|woff|woff2|ttf|eot)$/i.test(pathname)
    ) {
      return NextResponse.next();
    }

    // Handle public pages with internationalization only
    if (isPublicPage(pathname)) {
      const response = intlMiddleware(req);
      return response instanceof NextResponse ? addSecurityHeaders(response) : response;
    }
    
    // For protected routes, redirect to sign-in if no session
    // The actual authentication check will happen in the page components
    if (isProtectedRoute(pathname)) {
      // Check if there's a session token in cookies
      const sessionToken = req.cookies.get('authjs.session-token') || req.cookies.get('__Secure-authjs.session-token');
      
      if (!sessionToken) {
        // Redirect to sign in with locale support
        const locale = extractLocale(pathname) || routing.defaultLocale;
        const signInUrl = new URL(`/${locale}/auth/signin`, req.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
      }
    }
    
    // Apply internationalization for all other pages
    const response = intlMiddleware(req);
    return response instanceof NextResponse ? addSecurityHeaders(response) : response;

  } catch (error) {
    console.error('Middleware execution error:', error);
    
    // Fallback behavior: try to apply basic i18n, or redirect to error page
    try {
      return intlMiddleware(req);
    } catch (fallbackError) {
      console.error('Fallback middleware error:', fallbackError);
      // Last resort: redirect to error page
      return NextResponse.redirect(new URL('/auth/error', req.url));
    }
  }
}

export const config = {
  // Enhanced matcher for better performance - exclude more static assets
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - _vercel (Vercel internal)
     * - favicon.ico, robots.txt, etc. (static files)
     * Enhanced to exclude more common static file patterns
     */
    '/((?!api|_next/static|_next/image|_vercel|favicon.ico|robots.txt|sitemap.xml|manifest.json).*)',
  ],
};