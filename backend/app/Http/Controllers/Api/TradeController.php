<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Asset;
use App\Models\Transaction;
use App\Models\Wallet;
use Illuminate\Support\Facades\Http;

class TradeController extends Controller
{
    // ПОКУПКА КРИПТОВАЛЮТЫ
    public function buy(Request $request)
    {
        // 1. Валидация
        $request->validate([
            'coin_id'    => 'required|string',
            'symbol'     => 'required|string',
            'amount_usd' => 'required|numeric|min:1',
        ]);

        $user = $request->user();
        $user->load('wallet');

        $cost = $request->amount_usd;

        // В методе buy() добавить после валидации:

        $asset = Asset::where('name', $request->coin_id)->first();

        if ($asset && $asset->icon_url) {
            // Иконка уже есть в БД
            $logoUrl = $asset->icon_url;
        } else {
            // Если нет - получаем из API и сохраняем
            $coinData = Http::withoutVerifying()
                ->get("https://api.coingecko.com/api/v3/coins/{$coinId}")
                ->json();

            $logoUrl = $coinData['image']['small'] ?? null;
        }


        // 2. Проверка баланса
        if (!$user->wallet || $user->wallet->balance < $cost) {
            return response()->json(['message' => 'Недостаточно средств'], 400);
        }

        // 3. Запрос полной информации о монете (с логотипом)
        $coinId = $request->coin_id;

        try {
            $coinData = Http::withoutVerifying()
                ->get("https://api.coingecko.com/api/v3/coins/{$coinId}")
                ->json();

            $price = $coinData['market_data']['current_price']['usd'] ?? null;
            $logoUrl = $coinData['image']['small'] ?? null;

            if (!$price) {
                return response()->json(['message' => 'Не удалось получить цену'], 503);
            }
        } catch (\Exception $e) {
            return response()->json(['message' => 'Ошибка API'], 503);
        }

        // 4. Рассчитываем количество криптовалюты
        $cryptoAmount = $cost / $price;

        // 5. Списываем USD
        $user->wallet->balance -= $cost;
        $user->wallet->save();

        // 6. Добавляем актив
        $asset = Asset::firstOrNew([
            'user_id' => $user->id,
            'name'    => $coinId,
        ]);

        if (!$asset->exists) {
            $asset->symbol = strtoupper($request->symbol);
            $asset->amount = 0;
        }

        $asset->amount += $cryptoAmount;
        $asset->logo_url = $logoUrl; // сохраняем иконку
        $asset->save();

        // 7. Записываем транзакцию
        Transaction::create([
            'user_id'   => $user->id,
            'asset_id'  => $asset->id,
            'type'      => 'buy',
            'status'    => 'completed',
            'amount'    => $cryptoAmount,
            'price_usd' => $price,
            'total_usd' => $cost,
            'description' => "Покупка {$cryptoAmount} {$request->symbol}",
        ]);

        return response()->json([
            'message'     => "Куплено {$cryptoAmount} {$request->symbol}",
            'new_balance' => $user->wallet->balance,
            'asset'       => $asset,
        ]);
    }

    // ПРОДАЖА КРИПТОВАЛЮТЫ
    public function sell(Request $request)
    {
        $request->validate([
            'asset_id' => 'required|exists:assets,id',
            'amount' => 'required|numeric|min:0.00000001',
            // Разрешаем принимать цену с фронтенда
            'price_usd' => 'required|numeric|min:0',
        ]);

        $user = $request->user();
        // Используем firstOrNew или find, чтобы не упасть, если кошелька нет,
        // но лучше убедиться, что он есть.
        $wallet = Wallet::where('user_id', $user->id)->first();

        if (!$wallet) {
            return response()->json(['message' => 'Кошелек пользователя не найден'], 404);
        }

        // 1. Ищем актив
        $asset = Asset::where('id', $request->asset_id)
                    ->where('user_id', $user->id)
                    ->first();

        if (!$asset) return response()->json(['message' => 'Актив не найден'], 404);

        // Округляем до 8 знаков для корректного сравнения float
        if (round($asset->amount, 8) < round($request->amount, 8)) {
            return response()->json(['message' => 'Недостаточно монет для продажи'], 400);
        }

        // 2. Считаем сколько получим USD
        $usdAmount = $request->amount * $request->price_usd;

        // 3. Списываем монеты
        $asset->amount -= $request->amount;

        // Флаг для удаления, но само удаление делаем в конце
        $shouldDeleteAsset = false;

        // Если остаток мизерный (меньше 1 сатоши), считаем что 0
        if ($asset->amount < 0.00000001) {
            $asset->amount = 0;
            $shouldDeleteAsset = true;
        }

        // Сохраняем изменение баланса актива (пока не удаляем!)
        $asset->save();

        // 4. Начисляем доллары
        $wallet->balance += $usdAmount;
        $wallet->save();

        // 5. История
        // Создаем транзакцию ПОКА АКТИВ ЕЩЕ СУЩЕСТВУЕТ
        $transaction = Transaction::create([
            'user_id' => $user->id,
            'asset_id' => $asset->id,
            'type' => 'sell',
            'status' => 'completed',
            'amount' => $request->amount,
            'price_usd' => $request->price_usd,
            'total_usd' => $usdAmount,
            'description' => "Продажа {$request->amount} {$asset->symbol}",
        ]);
        if ($shouldDeleteAsset) {
            $asset->delete();
        }

        return response()->json([
        'message' => 'Продажа успешна!',
        'new_balance' => $wallet->balance,
        'asset_deleted' => $shouldDeleteAsset,
        'remaining_amount' => $asset->amount
        ]);
    }
}
