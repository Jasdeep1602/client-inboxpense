import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import * as jose from 'jose';

/**
 * A helper function to verify the JWT from the request cookies.
 * This runs in the Edge runtime, so it's very fast.
 */
async function verifyAuth(token: string): Promise<boolean> {
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    // The algorithm must be specified for jose to work in the Edge runtime.
    await jose.jwtVerify(token, secret, { algorithms: ['HS256'] });
    return true; // Token is valid
  } catch (error) {
    console.error(
      'Auth Middleware: JWT Verification failed:',
      (error as Error).message
    );
    return false; // Token is invalid (expired, wrong signature, etc.)
  }
}

/**
 * This is the main middleware function that runs on matching requests.
 */
export async function middleware(request: NextRequest) {
  const jwt = request.cookies.get('jwt')?.value;
  const { pathname } = request.nextUrl;

  // --- Define Protected and Public Routes ---
  // Any route starting with a path in this array will require authentication.
  const protectedRoutes = ['/dashboard', '/settings'];
  const publicRoutes = ['/']; // Routes that a logged-in user should be redirected away from.

  const isProtectedRoute = protectedRoutes.some((path) =>
    pathname.startsWith(path)
  );
  const isPublicRoute = publicRoutes.includes(pathname);

  // --- Logic for Protected Routes ---
  if (isProtectedRoute) {
    if (!jwt || !(await verifyAuth(jwt))) {
      // If the token is missing or invalid, redirect to the home page to log in.
      const response = NextResponse.redirect(new URL('/', request.url));
      // Clear the invalid cookie.
      response.cookies.delete('jwt');
      return response;
    }
  }

  // --- Logic for Public Routes ---
  // If the user has a valid token and is trying to access a public-only route (like the home/login page),
  // redirect them to their dashboard.
  if (isPublicRoute && jwt && (await verifyAuth(jwt))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // If none of the above conditions are met, allow the request to proceed.
  return NextResponse.next();
}

/**
 * This configures which paths the middleware will run on.
 * It's more efficient to exclude static assets and API routes.
 */
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
