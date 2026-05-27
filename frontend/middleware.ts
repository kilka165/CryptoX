import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const protectedRoutes = [
    '/profile',
    '/p2p',
    '/staking',
    '/deposit',
    '/withdraw',
    '/convert',
    '/settings',
];

const authRoutes = ['/login', '/register'];

export function middleware(request: NextRequest) {
    const { pathname } = request.nextUrl;
    const token = request.cookies.get('auth_token')?.value
        || request.headers.get('authorization')?.replace('Bearer ', '');

    const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

    if (isProtected && !token) {
        return NextResponse.redirect(new URL('/login', request.url));
    }

    if (isAuthRoute && token) {
        return NextResponse.redirect(new URL('/profile', request.url));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/profile/:path*',
        '/p2p/:path*',
        '/staking/:path*',
        '/deposit/:path*',
        '/withdraw/:path*',
        '/convert/:path*',
        '/settings/:path*',
        '/login',
        '/register',
    ],
};
