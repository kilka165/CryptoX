<?php

namespace App\Services;

use App\Models\User;
use App\Models\Asset;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class ConvertService
{
    public function validateConversion(User $user, array $fromCoins, array $toCoins): array
    {
        $errors = [];

        // Проверка баланса для каждой монеты
        foreach ($fromCoins as $coinData) {
            $asset = $user->assets()->where('name', $coinData['coin_id'])->first();

            if (!$asset) {
                $errors[] = "У вас нет монеты {$coinData['coin_id']}";
                continue;
            }

            if ($asset->amount < $coinData['amount']) {
                $errors[] = "Недостаточно {$coinData['coin_id']}. Доступно: {$asset->amount}";
            }
        }

        // Проверка максимум 5 монет
        if (count($fromCoins) > 5) {
            $errors[] = "Максимум 5 монет для обмена";
        }

        return $errors;
    }

    public function executeMultiSwap(User $user, array $fromCoins, array $toCoins): array
    {
        DB::beginTransaction();

        try {
            $totalUsdValue = 0;

            // Списываем все монеты "из"
            foreach ($fromCoins as $coinData) {
                $asset = $user->assets()->where('name', $coinData['coin_id'])->first();

                if (!$asset || $asset->amount < $coinData['amount']) {
                    throw new \Exception("Недостаточно {$coinData['coin_id']}");
                }

                // Получаем текущую цену монеты
                $price = $this->getCoinPrice($coinData['coin_id'], $user->currency ?? 'USD');
                $totalUsdValue += $coinData['amount'] * $price;

                // Уменьшаем баланс
                $asset->amount -= $coinData['amount'];
                $asset->save();
            }

            // Распределяем на монеты "в"
            foreach ($toCoins as $coinData) {
                $targetAsset = $user->assets()->firstOrCreate(
                    ['name' => $coinData['coin_id'], 'user_id' => $user->id],
                    ['symbol' => strtoupper($coinData['coin_id']), 'amount' => 0]
                );

                $toPrice = $this->getCoinPrice($coinData['coin_id'], $user->currency ?? 'USD');
                $weight = $coinData['weight'] ?? 1;
                $amountToAdd = ($totalUsdValue * $weight) / $toPrice;

                $targetAsset->amount += $amountToAdd;
                $targetAsset->save();
            }

            DB::commit();

            return [
                'success' => true,
                'message' => 'Обмен выполнен успешно',
                'total_value' => $totalUsdValue,
            ];

        } catch (\Exception $e) {
            DB::rollBack();
            throw $e;
        }
    }

    private function getCoinPrice(string $coinId, string $currency = 'USD'): float
    {
        $response = Http::get("https://api.coingecko.com/api/v3/simple/price", [
            'ids' => $coinId,
            'vs_currencies' => strtolower($currency),
        ]);

        if ($response->successful()) {
            $data = $response->json();
            return $data[$coinId][strtolower($currency)] ?? 0;
        }

        return 0;
    }

    public function calculateExchangeRates(array $fromCoins, string $toCoinId): array
    {
        $rates = [];

        foreach ($fromCoins as $fromCoin) {
            $fromPrice = $this->getCoinPrice($fromCoin['coin_id']);
            $toPrice = $this->getCoinPrice($toCoinId);

            $rates[] = [
                'from' => $fromCoin['coin_id'],
                'to' => $toCoinId,
                'rate' => $toPrice > 0 ? $fromPrice / $toPrice : 0,
                'inverse_rate' => $fromPrice > 0 ? $toPrice / $fromPrice : 0,
            ];
        }

        return $rates;
    }
}
