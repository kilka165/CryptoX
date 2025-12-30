<?php

namespace App\Services;

use App\Models\User;

class UserSettingsService
{
    public function getUserSettings(User $user): array
    {
        return [
            'currency' => $user->currency ?? 'USD',
            'balance' => $user->wallet->balance ?? 0,
        ];
    }

    public function updateUserCurrency(User $user, string $currency): void
    {
        $user->currency = $currency;
        $user->save();
    }

    public function getExchangeRate(string $fromCurrency, string $toCurrency): float
    {
        // Здесь можно подключить внешний API для курсов валют
        // Или использовать закешированные значения
        $rates = [
            'USD' => ['RUB' => 90, 'EUR' => 0.92, 'KZT' => 450],
            'RUB' => ['USD' => 0.011, 'EUR' => 0.010, 'KZT' => 5],
            'EUR' => ['USD' => 1.09, 'RUB' => 100, 'KZT' => 490],
            'KZT' => ['USD' => 0.0022, 'RUB' => 0.20, 'EUR' => 0.002],
        ];

        if ($fromCurrency === $toCurrency) {
            return 1.0;
        }

        return $rates[$fromCurrency][$toCurrency] ?? 1.0;
    }
}
