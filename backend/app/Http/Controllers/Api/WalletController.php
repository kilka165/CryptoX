<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class WalletController extends Controller
{
    public function getBalance(Request $request)
    {
        $user = $request->user();
        $wallet = $user->wallet;

        if (!$wallet) {
            return response()->json(['balance' => 0]);
        }

        return response()->json([
            'balance' => $wallet->balance,
            'currency' => $user->currency ?? 'USD',
        ]);
    }

    public function deposit(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        DB::beginTransaction();
        try {
            $wallet->balance += $validated['amount'];
            $wallet->save();

            // Создаём транзакцию без asset_id (для фиатных операций)
            Transaction::create([
                'user_id' => $user->id,
                'asset_id' => null,
                'type' => 'deposit',
                'status' => 'completed',
                'amount' => $validated['amount'],
                'price_usd' => 1,
                'total_usd' => $validated['amount'],
                'description' => 'Пополнение кошелька',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Пополнение успешно',
                'new_balance' => $wallet->balance,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ошибка при пополнении'
            ], 500);
        }
    }

    public function withdraw(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        if ($wallet->balance < $validated['amount']) {
            return response()->json(['message' => 'Недостаточно средств'], 400);
        }

        // Дневной лимит вывода зависит от уровня защиты аккаунта:
        // 2FA — без лимита, e-mail подтверждён — $1000/день, иначе — $100/день.
        $dailyLimit = $user->two_factor_confirmed_at
            ? null
            : ($user->email_verified_at ? 1000 : 100);

        if ($dailyLimit !== null) {
            $withdrawnToday = (float) Transaction::where('user_id', $user->id)
                ->where('type', 'withdraw')
                ->whereDate('created_at', today())
                ->sum('total_usd');

            if ($withdrawnToday + $validated['amount'] > $dailyLimit) {
                $remaining = max(0, $dailyLimit - $withdrawnToday);

                return response()->json([
                    'message' => "Превышен дневной лимит вывода (\${$dailyLimit}/день). "
                        . "Доступно сегодня: \${$remaining}. Подтвердите e-mail или включите 2FA, чтобы повысить лимит.",
                    'daily_limit' => $dailyLimit,
                    'withdrawn_today' => $withdrawnToday,
                    'remaining_today' => $remaining,
                ], 403);
            }
        }

        DB::beginTransaction();
        try {
            $wallet->balance -= $validated['amount'];
            $wallet->save();

            // Создаём транзакцию без asset_id (для фиатных операций)
            Transaction::create([
                'user_id' => $user->id,
                'asset_id' => null,
                'type' => 'withdraw',
                'status' => 'completed',
                'amount' => $validated['amount'],
                'price_usd' => 1,
                'total_usd' => $validated['amount'],
                'description' => 'Вывод средств из кошелька',
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Вывод успешен',
                'new_balance' => $wallet->balance,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ошибка при выводе'
            ], 500);
        }
    }

    public function userAssets(Request $request)
    {
        $user = $request->user();
        $assets = Asset::where('user_id', $user->id)
            ->where('amount', '>', 0)
            ->get();

        return response()->json($assets);
    }
}
