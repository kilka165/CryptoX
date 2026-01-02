<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;

class TradeController extends Controller
{
    public function buy(Request $request)
    {
        $validated = $request->validate([
            'coin_id' => 'required|string',
            'amount' => 'required|numeric|min:0.00000001',
            'price_usd' => 'required|numeric|min:0',
        ]);

        $user = $request->user();
        $coinId = $validated['coin_id'];
        $amount = $validated['amount'];
        $priceUsd = $validated['price_usd'];
        $totalCost = $amount * $priceUsd;

        $wallet = Wallet::where('user_id', $user->id)->first();
        if (!$wallet || $wallet->balance < $totalCost) {
            return response()->json([
                'success' => false,
                'message' => 'Недостаточно средств на балансе'
            ], 400);
        }

        DB::beginTransaction();

        try {
            $wallet->balance -= $totalCost;
            $wallet->save();

            $asset = Asset::firstOrCreate(
                [
                    'user_id' => $user->id,
                    'name' => $coinId,
                ],
                [
                    'symbol' => strtoupper(substr($coinId, 0, 3)),
                    'amount' => 0,
                ]
            );

            $asset->amount += $amount;
            $asset->save();

            Transaction::create([
                'user_id' => $user->id,
                'asset_id' => $asset->id,
                'type' => 'buy',
                'amount' => $amount,
                'price_usd' => $priceUsd,
                'total_usd' => $totalCost,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Покупка выполнена успешно',
                'asset' => $asset,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Buy error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при покупке: ' . $e->getMessage()
            ], 500);
        }
    }

    public function sell(Request $request)
    {
        $validated = $request->validate([
            'coin_id' => 'required|string',
            'amount' => 'required|numeric|min:0.00000001',
            'price_usd' => 'required|numeric|min:0',
        ]);

        $user = $request->user();
        $coinId = $validated['coin_id'];
        $amount = $validated['amount'];
        $priceUsd = $validated['price_usd'];
        $totalValue = $amount * $priceUsd;

        $asset = Asset::where('user_id', $user->id)
            ->where('name', $coinId)
            ->first();

        if (!$asset || $asset->amount < $amount) {
            return response()->json([
                'success' => false,
                'message' => 'Недостаточно криптовалюты для продажи'
            ], 400);
        }

        DB::beginTransaction();

        try {
            $asset->amount -= $amount;
            if ($asset->amount <= 0.00000001) {
                $asset->delete();
            } else {
                $asset->save();
            }

            $wallet = Wallet::firstOrCreate(['user_id' => $user->id], ['balance' => 0]);
            $wallet->balance += $totalValue;
            $wallet->save();

            Transaction::create([
                'user_id' => $user->id,
                'asset_id' => $asset->id ?? null,
                'type' => 'sell',
                'amount' => $amount,
                'price_usd' => $priceUsd,
                'total_usd' => $totalValue,
            ]);

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Продажа выполнена успешно',
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Sell error: ' . $e->getMessage());
            return response()->json([
                'success' => false,
                'message' => 'Ошибка при продаже: ' . $e->getMessage()
            ], 500);
        }
    }

    public function multiSwap(Request $request)
    {
        try {
            $validated = $request->validate([
                'from_coins' => 'required|array|min:1',
                'from_coins.*.coin_id' => 'required|string',
                'from_coins.*.amount' => 'required|numeric|min:0.00000001',
                'from_coins.*.price_usd' => 'required|numeric|min:0',
                'to_coins' => 'required|array|min:1',
                'to_coins.*.coin_id' => 'required|string',
                'to_coins.*.weight' => 'required|numeric|min:0',
                'price_usd' => 'required|numeric|min:0',
            ]);

            $user = $request->user();
            $fromCoins = $validated['from_coins'];
            $toCoins = $validated['to_coins'];
            $toPriceUsd = $validated['price_usd'];

            DB::beginTransaction();

            $totalSoldUSD = 0;
            foreach ($fromCoins as $fc) {
                $coinId = $fc['coin_id'];
                $amount = $fc['amount'];
                $priceUsd = $fc['price_usd'];

                $asset = Asset::where('user_id', $user->id)
                    ->where('name', $coinId)
                    ->first();

                if (!$asset || $asset->amount < $amount) {
                    DB::rollBack();
                    return response()->json([
                        'success' => false,
                        'message' => "Недостаточно средств для монеты {$coinId}"
                    ], 400);
                }

                $asset->amount -= $amount;
                if ($asset->amount <= 0.00000001) {
                    $assetId = $asset->id;
                    $asset->delete();
                } else {
                    $assetId = $asset->id;
                    $asset->save();
                }

                $soldUSD = $amount * $priceUsd;
                $totalSoldUSD += $soldUSD;

                Transaction::create([
                    'user_id' => $user->id,
                    'asset_id' => $assetId,
                    'type' => 'sell',
                    'amount' => $amount,
                    'price_usd' => $priceUsd,
                    'total_usd' => $soldUSD,
                ]);
            }

            $totalWeight = 0;
            foreach ($toCoins as $tc) {
                $totalWeight += $tc['weight'];
            }

            foreach ($toCoins as $tc) {
                $coinId = $tc['coin_id'];
                $weight = $tc['weight'];

                $allocatedUSD = ($totalSoldUSD * $weight) / $totalWeight;
                $boughtAmount = $allocatedUSD / $toPriceUsd;

                $asset = Asset::firstOrCreate(
                    [
                        'user_id' => $user->id,
                        'name' => $coinId,
                    ],
                    [
                        'symbol' => strtoupper(substr($coinId, 0, 3)),
                        'amount' => 0,
                    ]
                );

                $asset->amount += $boughtAmount;
                $asset->save();

                Transaction::create([
                    'user_id' => $user->id,
                    'asset_id' => $asset->id,
                    'type' => 'buy',
                    'amount' => $boughtAmount,
                    'price_usd' => $toPriceUsd,
                    'total_usd' => $allocatedUSD,
                ]);
            }

            DB::commit();

            return response()->json([
                'success' => true,
                'message' => 'Обмен выполнен успешно',
            ]);

        } catch (\Illuminate\Validation\ValidationException $e) {
            return response()->json([
                'success' => false,
                'message' => 'Ошибка валидации',
                'errors' => $e->errors(),
            ], 422);
        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Multi-swap error: ' . $e->getMessage());

            return response()->json([
                'success' => false,
                'message' => 'Ошибка сервера: ' . $e->getMessage(),
            ], 500);
        }
    }
}
