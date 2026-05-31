<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class HandleCors
{
    public function handle(Request $request, Closure $next): Response
    {
        $origin = $this->resolveOrigin($request);

        // Обработка preflight запросов
        if ($request->getMethod() === "OPTIONS") {
            return $this->withCorsHeaders(response('', 200), $origin);
        }

        return $this->withCorsHeaders($next($request), $origin);
    }

    /**
     * Определяем, какой Origin вернуть: эхо-ответ для разрешённых источников.
     * Разрешены: FRONTEND_URL из окружения, локальная разработка и превью Vercel.
     */
    private function resolveOrigin(Request $request): string
    {
        $origin = $request->headers->get('Origin', '');

        $allowed = array_filter([
            env('FRONTEND_URL'),
            'http://localhost:3000',
            'http://127.0.0.1:3000',
        ]);

        if (in_array($origin, $allowed, true)) {
            return $origin;
        }

        // Любой превью-/прод-домен Vercel.
        if ($origin !== '' && preg_match('#^https://.*\.vercel\.app$#', $origin)) {
            return $origin;
        }

        // Фолбэк для локальной разработки.
        return 'http://localhost:3000';
    }

    private function withCorsHeaders(Response $response, string $origin): Response
    {
        return $response
            ->header('Access-Control-Allow-Origin', $origin)
            ->header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')
            ->header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With, Accept')
            ->header('Access-Control-Allow-Credentials', 'true')
            ->header('Vary', 'Origin');
    }
}
