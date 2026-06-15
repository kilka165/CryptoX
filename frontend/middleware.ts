import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

// P2P, конвертация и стейкинг открыты для всех — авторизация проверяется
// только в момент самой транзакции (модалкой со ссылкой на вход).
const protectedRoutes = [
    '/profile',
    '/deposit',
    '/withdraw',
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
        '/deposit/:path*',
        '/withdraw/:path*',
        '/settings/:path*',
        '/login',
        '/register',
    ],
};
