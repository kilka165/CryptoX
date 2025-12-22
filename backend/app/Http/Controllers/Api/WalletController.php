<?php

namespace App\Http\Controllers\Api;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use App\Models\Wallet;
use App\Models\Asset;
use App\Models\Transaction;

class WalletController extends Controller
{
    public function getBalance(Request $request)
    {
        $user = $request->user();

        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $wallet = Wallet::where('user_id', $user->id)->first();

        if (!$wallet) {
            return response()->json(['message' => 'Кошелек не найден'], 404);
        }

        return response()->json($wallet);
    }

    public function userAssets(Request $request)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $assets = Asset::where('user_id', $user->id)
            ->where('amount', '>', 0)
            ->get(['id', 'name', 'symbol', 'amount', 'logo_url']);

        return response()->json($assets);
    }

    public function withdraw(Request $request)
    {
        // Валидация
        $request->validate([
            'amount' => 'required|numeric|min:10', // Минимальный вывод, например $10
            // Можно добавить поле 'address' или 'card_number' если нужно сохранять куда выводят
        ]);

        $user = $request->user();

        // Получаем кошелек
        $wallet = $user->wallet;

        if (!$wallet) {
            return response()->json(['message' => 'Кошелек не найден'], 404);
        }

        $amount = (float)$request->amount;
        $commissionRate = 0.01; // 1%
        $commission = $amount * $commissionRate;
        $totalDeduction = $amount + $commission; // Списываем сумму + комиссию

        // Проверка баланса
        if ($wallet->balance < $totalDeduction) {
            return response()->json([
                'message' => 'Недостаточно средств (с учетом комиссии 1%)',
                'required' => $totalDeduction,
                'balance' => $wallet->balance
            ], 400);
        }

        // Списание средств
        $wallet->balance -= $totalDeduction;
        $wallet->save();


        \App\Models\Transaction::create([
            'user_id' => $user->id,
            'asset_id' => null, // Вывод фиата
            'type' => 'withdraw',
            'status' => 'completed', // Или 'pending', если нужна ручная проверка админом
            'amount' => $amount,
            'price_usd' => 1,
            'total_usd' => $totalDeduction, // Списано с баланса
            'description' => "Вывод средств: \${$amount} (Комиссия: \${$commission})",
        ]);

        return response()->json([
            'message' => 'Заявка на вывод создана',
            'new_balance' => $wallet->balance,
            'withdrawn' => $amount,
            'commission' => $commission
        ]);
    }

    public function deposit(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric|min:1',
            'currency' => 'required|string', // Например: USD
        ]);

        $user = $request->user();

        // Получаем или создаем кошелек
        $wallet = $user->wallet ?? $user->wallet()->create(['balance' => 0]);

        // Начисляем баланс
        $wallet->balance += $request->amount;
        $wallet->save();

        // --- ЗАПИСЬ В ИСТОРИЮ ---
        Transaction::create([
            'user_id' => $user->id,
            'asset_id' => null, // Для депозита нет крипто-актива
            'type' => 'deposit',
            'status' => 'completed',
            'amount' => $request->amount, // Сумма пополнения
            'price_usd' => 1, // Цена 1 доллара = 1 доллар
            'total_usd' => $request->amount,
            'description' => "Пополнение баланса ({$request->amount} {$request->currency})",
        ]);

        return response()->json([
            'message' => 'Баланс успешно пополнен',
            'new_balance' => $wallet->balance
        ]);
    }
}
