import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    const token = request.cookies.get('token')?.value;
    const { pathname } = request.nextUrl;

    // Define route groups
    const isAuthPage = pathname === '/login' || pathname === '/register';

    const protectedPaths = [
        '/dashboard',
        '/transactions',
        '/sign-transaction',
        '/verify-transaction',
        '/settings',
        '/account'
    ];

    const isProtectedPage = protectedPaths.some(path => pathname.startsWith(path));

    const cookieHeader = request.headers.get('cookie');
    console.log(`DEBUG: Middleware - Path: ${pathname}, HasToken: ${!!token}, Header: ${cookieHeader}`);

    // 1. Redirect unauthenticated users from protected pages to login
    if (isProtectedPage && !token) {
        const url = new URL('/login', request.url);
        url.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(url);
    }

    // 2. Redirect authenticated users away from login/register to dashboard
    if (isAuthPage && token) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/dashboard/:path*',
        '/transactions/:path*',
        '/sign-transaction/:path*',
        '/verify-transaction/:path*',
        '/settings/:path*',
        '/account/:path*',
        '/login',
        '/register',
    ],
};
