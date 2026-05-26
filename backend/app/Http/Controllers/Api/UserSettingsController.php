<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Http\JsonResponse;

class UserSettingsController extends Controller
{
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

    public function getExchangeRate(Request $request): JsonResponse
    {
        $from = $request->query('from', 'USD');
        $to = $request->query('to', 'USD');

        $rates = [
            'USD' => ['RUB' => 90, 'EUR' => 0.92, 'KZT' => 450, 'USD' => 1],
            'RUB' => ['USD' => 0.011, 'EUR' => 0.010, 'KZT' => 5, 'RUB' => 1],
            'EUR' => ['USD' => 1.09, 'RUB' => 100, 'KZT' => 490, 'EUR' => 1],
            'KZT' => ['USD' => 0.0022, 'RUB' => 0.20, 'EUR' => 0.002, 'KZT' => 1],
        ];

        $rate = $rates[$from][$to] ?? 1.0;

        return response()->json([
            'from' => $from,
            'to' => $to,
            'rate' => $rate,
        ]);
    }
}
