<?php

namespace App\Services;

use App\Models\PlatformAccount;

/**
 * Единая логика расчёта и учёта комиссий.
 * Ставки берутся из config/fees.php (значения из .env).
 */
class FeeService
{
    /**
     * Ставка комиссии для типа операции ('trade' | 'withdraw') как доля (0.01 = 1%).
     */
    public function rate(string $type): float
    {
        return (float) config("fees.$type", 0.0);
    }

    /**
     * Сумма комиссии в USD для базовой суммы операции.
     */
    public function calculate(float $base, string $type): float
    {
        return round($base * $this->rate($type), 2);
    }

    /**
     * Зачислить удержанную комиссию на счёт платформы.
     * Вызывать внутри открытой DB::transaction операции.
     */
    public function creditPlatform(float $fee, string $currency = 'USD'): void
    {
        if ($fee <= 0) {
            return;
        }

        // Гарантируем наличие строки, затем атомарный инкремент на уровне SQL.
        PlatformAccount::firstOrCreate(['currency' => $currency], ['balance' => 0]);
        PlatformAccount::where('currency', $currency)->increment('balance', $fee);
    }
}
