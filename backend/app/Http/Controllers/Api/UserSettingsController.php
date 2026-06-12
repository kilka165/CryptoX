<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\CurrencyService;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserSettingsController extends Controller
{
    public function __construct(private CurrencyService $currency) {}

    public function getSettings(Request $request): JsonResponse
    {
        $user = $request->user();

        return response()->json([
            'currency' => $user->currency ?? 'USD',
            'balance' => $user->wallet->balance ?? 0,
        ]);
    }

    public function updateCurrency(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'currency' => 'required|string|in:USD,EUR,RUB,KZT',
        ]);

        $user = $request->user();
        $user->currency = $validated['currency'];
        $user->save();

        return response()->json([
            'message' => 'Валюта обновлена',
            'currency' => $validated['currency'],
        ]);
    }

    /**
     * Загрузка/смена аватара. Принимаем data URL (base64), ужатый на клиенте
     * до ~256px, и кладём его прямо в БД — без storage:link и эфемерных файлов.
     */
    public function updateAvatar(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'avatar' => ['required', 'string'],
        ]);

        $dataUrl = $validated['avatar'];

        // Допускаем только image data URL c base64-полезной нагрузкой.
        if (! preg_match('#^data:image/(png|jpe?g|webp|gif);base64,#i', $dataUrl)) {
            return response()->json(['message' => 'Недопустимый формат изображения'], 422);
        }

        $base64 = substr($dataUrl, strpos($dataUrl, ',') + 1);
        $binary = base64_decode($base64, true);
        if ($binary === false) {
            return response()->json(['message' => 'Не удалось прочитать изображение'], 422);
        }

        // Лимит ~1 МБ на готовое изображение (после ресайза оно крошечное).
        if (strlen($binary) > 1024 * 1024) {
            return response()->json(['message' => 'Изображение слишком большое (макс. 1 МБ)'], 422);
        }

        $user = $request->user();
        $user->avatar = $dataUrl;
        $user->save();

        return response()->json([
            'message' => 'Аватар обновлён',
            'avatar' => $dataUrl,
        ]);
    }

    public function deleteAvatar(Request $request): JsonResponse
    {
        $user = $request->user();
        $user->avatar = null;
        $user->save();

        return response()->json(['message' => 'Аватар удалён']);
    }

    /**
     * Курс конвертации между двумя валютами через единый кэшированный CurrencyService.
     */
    public function getExchangeRate(Request $request): JsonResponse
    {
        $from = (string) $request->query('from', 'USD');
        $to = (string) $request->query('to', 'USD');

        $rate = $this->currency->convert(1.0, $from, $to);

        return response()->json([
            'from' => strtoupper($from),
            'to' => strtoupper($to),
            'rate' => $rate,
        ]);
    }
}
