<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

/**
 * Блокирует маршрут, если e-mail пользователя не подтверждён.
 * Зарегистрирован как алиас 'verified' в bootstrap/app.php.
 * Используется опционально (основное ограничение — дневной лимит вывода).
 */
class EnsureEmailIsVerified
{
    public function handle(Request $request, Closure $next): Response
    {
        $user = $request->user();

        if (! $user || ! $user->email_verified_at) {
            return response()->json([
                'message' => 'Требуется подтверждение e-mail.',
                'email_verified' => false,
            ], 403);
        }

        return $next($request);
    }
}
