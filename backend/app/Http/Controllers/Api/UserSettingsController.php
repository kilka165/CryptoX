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
