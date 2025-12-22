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
}
