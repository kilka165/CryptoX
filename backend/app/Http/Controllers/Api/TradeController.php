<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Support\Facades\Http;

class TradeController extends Controller
{
    // ПОКУПКА КРИПТОВАЛЮТЫ
    public function buy(Request $request)
    {
        $request->validate([
            'coin_id'    => 'required|string',
            'symbol'     => 'required|string',
            'amount_usd' => 'required|numeric|min:1',
        ]);

        $user = $request->user();
        $user->load('wallet');

        $cost   = $request->amount_usd;
        $coinId = $request->coin_id; // ✅ объявлено один раз

        // Ищем актив и логотип
        $asset = Asset::where('name', $coinId)->first();

        if ($asset && $asset->icon_url) {
            $logoUrl = $asset->icon_url;
        } else {
            try {
                $coinData = Http::withoutVerifying()
                    ->get("https://api.coingecko.com/api/v3/coins/{$coinId}")
                    ->json();

                $logoUrl = $coinData['image']['small'] ?? null;
            } catch (\Exception $e) {
                $logoUrl = null;
            }
        }

        if (!$user->wallet || $user->wallet->balance < $cost) {
            return response()->json(['message' => 'Недостаточно средств'], 400);
        }

        try {
            $coinData = Http::withoutVerifying()
                ->get("https://api.coingecko.com/api/v3/coins/{$coinId}")
                ->json();

            $price   = $coinData['market_data']['current_price']['usd'] ?? null;
            $logoUrl = $coinData['image']['small'] ?? $logoUrl;

            if (!$price) {
                return response()->json(['message' => 'Не удалось получить цену'], 503);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ошибка API'], 503);
        }

        $cryptoAmount = $cost / $price;

        $user->wallet->balance -= $cost;
        $user->wallet->save();

        $asset = Asset::firstOrNew([
            'user_id' => $user->id,
            'name'    => $coinId,
        ]);

        if (!$asset->exists) {
            $asset->symbol = strtoupper($request->symbol);
            $asset->amount = 0;
        }

        $asset->amount   += $cryptoAmount;
        $asset->logo_url = $logoUrl;
        $asset->save();

        Transaction::create([
            'user_id'    => $user->id,
            'asset_id'   => $asset->id,
            'type'       => 'buy',
            'status'     => 'completed',
            'amount'     => $cryptoAmount,
            'price_usd'  => $price,
            'total_usd'  => $cost,
            'description'=> "Покупка {$cryptoAmount} {$request->symbol}",
        ]);

        return response()->json([
            'message'      => "Куплено {$cryptoAmount} {$request->symbol}",
            'new_balance'  => $user->wallet->balance,
            'asset'        => $asset,
        ]);
    }

    // ПРОДАЖА КРИПТОВАЛЮТЫ
    public function sell(Request $request)
    {
        $request->validate([
            'asset_id'  => 'required|exists:assets,id',
            'amount'    => 'required|numeric|min:0.00000001',
            'price_usd' => 'required|numeric|min:0',
        ]);

        $user = $request->user();
        $wallet = Wallet::where('user_id', $user->id)->first();

        if (!$wallet) {
            return response()->json(['message' => 'Кошелек пользователя не найден'], 404);
        }

        $asset = Asset::where('id', $request->asset_id)
            ->where('user_id', $user->id)
            ->first();

        if (!$asset) {
            return response()->json(['message' => 'Актив не найден'], 404);
        }

        if (round($asset->amount, 8) < round($request->amount, 8)) {
            return response()->json(['message' => 'Недостаточно монет для продажи'], 400);
        }

        $usdAmount = $request->amount * $request->price_usd;

        $asset->amount -= $request->amount;
        $shouldDeleteAsset = false;

        if ($asset->amount < 0.00000001) {
            $asset->amount = 0;
            $shouldDeleteAsset = true;
        }

        $asset->save();

        $wallet->balance += $usdAmount;
        $wallet->save();

        Transaction::create([
            'user_id'   => $user->id,
            'asset_id'  => $asset->id,
            'type'      => 'sell',
            'status'    => 'completed',
            'amount'    => $request->amount,
            'price_usd' => $request->price_usd,
            'total_usd' => $usdAmount,
            'description' => "Продажа {$request->amount} {$asset->symbol}",
        ]);

        if ($shouldDeleteAsset) {
            $asset->delete();
        }

        return response()->json([
            'message'          => 'Продажа успешна!',
            'new_balance'      => $wallet->balance,
            'asset_deleted'    => $shouldDeleteAsset,
            'remaining_amount' => $asset->amount,
        ]);
    }



    public function swap(Request $request)
    {
        $request->validate([
            'from_coin_id' => 'required|string',
            'to_coin_id'   => 'required|string',
            'amount_from'  => 'required|numeric|min:0.00000001',
        ]);

        $user = $request->user();
        $user->load('wallet');

        $fromCoinId = $request->from_coin_id;
        $toCoinId   = $request->to_coin_id;
        $amountFrom = $request->amount_from;

        // 1. Проверяем, что у пользователя есть актив "from"
        $assetFrom = Asset::where('user_id', $user->id)
            ->where('name', $fromCoinId)
            ->first();

        if (!$assetFrom || $assetFrom->amount < $amountFrom) {
            return response()->json(['message' => 'Недостаточно монет для обмена'], 400);
        }

        // 2. Получаем цены из CoinGecko
        try {
            $fromData = Http::withoutVerifying()
                ->get("https://api.coingecko.com/api/v3/coins/{$fromCoinId}")
                ->json();
            $toData = Http::withoutVerifying()
                ->get("https://api.coingecko.com/api/v3/coins/{$toCoinId}")
                ->json();

            $priceFrom = $fromData['market_data']['current_price']['usd'] ?? null;
            $priceTo   = $toData['market_data']['current_price']['usd'] ?? null;

            if (!$priceFrom || !$priceTo) {
                return response()->json(['message' => 'Не удалось получить цены'], 503);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ошибка CoinGecko API'], 503);
        }

        // 3. Рассчитываем эквивалент
        $usdValue   = $amountFrom * $priceFrom;
        $amountTo   = $usdValue / $priceTo;

        // 4. Списываем монеты "from"
        $assetFrom->amount -= $amountFrom;

        if ($assetFrom->amount < 0.00000001) {
            $assetFrom->amount = 0;
            $shouldDeleteFrom = true;
        } else {
            $shouldDeleteFrom = false;
        }
        $assetFrom->save();

        // 5. Добавляем монеты "to"
        $assetTo = Asset::firstOrNew([
            'user_id' => $user->id,
            'name'    => $toCoinId,
        ]);

        if (!$assetTo->exists) {
            $assetTo->symbol = strtoupper($request->to_symbol ?? $toCoinId);
            $assetTo->amount = 0;
            $assetTo->logo_url = $toData['image']['small'] ?? null;
        }

        $assetTo->amount += $amountTo;
        $assetTo->save();

        // 6. Записываем 2 транзакции (sell from + buy to) или одну swap
        Transaction::create([
            'user_id'    => $user->id,
            'asset_id'   => $assetFrom->id,
            'type'       => 'sell',
            'status'     => 'completed',
            'amount'     => $amountFrom,
            'price_usd'  => $priceFrom,
            'total_usd'  => $usdValue,
            'description'=> "Swap: продал {$amountFrom} {$assetFrom->symbol}",
        ]);

        Transaction::create([
            'user_id'    => $user->id,
            'asset_id'   => $assetTo->id,
            'type'       => 'buy',
            'status'     => 'completed',
            'amount'     => $amountTo,
            'price_usd'  => $priceTo,
            'total_usd'  => $usdValue,
            'description'=> "Swap: получил {$amountTo} {$assetTo->symbol}",
        ]);

        // Удаляем "from" если стало 0
        if ($shouldDeleteFrom) {
            $assetFrom->delete();
        }

        return response()->json([
            'message'      => 'Обмен успешен!',
            'amount_from'  => $amountFrom,
            'amount_to'    => $amountTo,
            'asset_from'   => $assetFrom,
            'asset_to'     => $assetTo,
        ]);
    }

        // app/Http/Controllers/Api/TradeController.php

public function multiSwap(Request $request)
{
    $request->validate([
        'from_coins' => 'required|array|min:1',
        'from_coins.*.coin_id' => 'required|string',
        'from_coins.*.amount' => 'required|numeric|min:0.00000001',
        'to_coins' => 'required|array|min:1',
        'to_coins.*.coin_id' => 'required|string',
        'to_coins.*.weight' => 'nullable|numeric|min:0', // процент распределения (опционально)
    ]);

    $user = $request->user();
    $user->load('wallet');

    $fromCoins = $request->from_coins;
    $toCoins = $request->to_coins;

    $totalUSD = 0;
    $fromAssets = [];

    // 1. Проверяем баланс и считаем сумму в USD
    foreach ($fromCoins as $fc) {
        $asset = Asset::where('user_id', $user->id)
            ->where('name', $fc['coin_id'])
            ->first();

        if (!$asset || $asset->amount < $fc['amount']) {
            return response()->json([
                'message' => "Недостаточно {$fc['coin_id']} для обмена"
            ], 400);
        }

        try {
            $coinData = Http::withoutVerifying()
                ->get("https://api.coingecko.com/api/v3/coins/{$fc['coin_id']}")
                ->json();

            $price = $coinData['market_data']['current_price']['usd'] ?? null;
            if (!$price) {
                return response()->json(['message' => "Не удалось получить цену {$fc['coin_id']}"], 503);
            }

            $usdValue = $fc['amount'] * $price;
            $totalUSD += $usdValue;

            $fromAssets[] = [
                'asset' => $asset,
                'amount' => $fc['amount'],
                'price' => $price,
                'usd_value' => $usdValue,
            ];
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ошибка CoinGecko API'], 503);
        }
    }

    // 2. Получаем цены целевых монет
    $toCoinsData = [];
    $totalWeight = 0;

    foreach ($toCoins as $tc) {
        $weight = $tc['weight'] ?? 1;
        $totalWeight += $weight;

        try {
            $coinData = Http::withoutVerifying()
                ->get("https://api.coingecko.com/api/v3/coins/{$tc['coin_id']}")
                ->json();

            $price = $coinData['market_data']['current_price']['usd'] ?? null;
            if (!$price) {
                return response()->json(['message' => "Не удалось получить цену {$tc['coin_id']}"], 503);
            }

            $toCoinsData[] = [
                'coin_id' => $tc['coin_id'],
                'price' => $price,
                'weight' => $weight,
                'logo_url' => $coinData['image']['small'] ?? null,
                'symbol' => strtoupper($coinData['symbol'] ?? $tc['coin_id']),
            ];
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ошибка CoinGecko API'], 503);
        }
    }

    // 3. Списываем "from" активы
    foreach ($fromAssets as $fa) {
        $fa['asset']->amount -= $fa['amount'];

        if ($fa['asset']->amount < 0.00000001) {
            $fa['asset']->amount = 0;
        }

        $fa['asset']->save();

        Transaction::create([
            'user_id' => $user->id,
            'asset_id' => $fa['asset']->id,
            'type' => 'sell',
            'status' => 'completed',
            'amount' => $fa['amount'],
            'price_usd' => $fa['price'],
            'total_usd' => $fa['usd_value'],
            'description' => "Multi-swap: продал {$fa['amount']} {$fa['asset']->symbol}",
        ]);

        if ($fa['asset']->amount == 0) {
            $fa['asset']->delete();
        }
    }

    // 4. Распределяем USD пропорционально весам и начисляем "to" активы
    $results = [];

    foreach ($toCoinsData as $tcd) {
        $share = ($tcd['weight'] / $totalWeight) * $totalUSD;
        $amountTo = $share / $tcd['price'];

        $assetTo = Asset::firstOrNew([
            'user_id' => $user->id,
            'name' => $tcd['coin_id'],
        ]);

        if (!$assetTo->exists) {
            $assetTo->symbol = $tcd['symbol'];
            $assetTo->amount = 0;
            $assetTo->logo_url = $tcd['logo_url'];
        }

        $assetTo->amount += $amountTo;
        $assetTo->save();

        Transaction::create([
            'user_id' => $user->id,
            'asset_id' => $assetTo->id,
            'type' => 'buy',
            'status' => 'completed',
            'amount' => $amountTo,
            'price_usd' => $tcd['price'],
            'total_usd' => $share,
            'description' => "Multi-swap: получил {$amountTo} {$tcd['symbol']}",
        ]);

        $results[] = [
            'coin_id' => $tcd['coin_id'],
            'amount' => $amountTo,
            'symbol' => $tcd['symbol'],
        ];
    }

    return response()->json([
        'message' => 'Множественный обмен успешен!',
        'total_usd' => $totalUSD,
        'results' => $results,
    ]);
    }

}
