<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Asset;
use App\Models\Transaction;
use App\Services\FeeService;
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

    public function withdraw(Request $request, FeeService $fees)
    {
        $validated = $request->validate([
            'amount' => 'required|numeric|min:0.01',
        ]);

        $user = $request->user();
        $wallet = $user->wallet;

        // Сумма вывода + комиссия (ставка из config/fees.php, как в «Итого к списанию» на фронте).
        $amount = round((float) $validated['amount'], 2);
        $commission = $fees->calculate($amount, 'withdraw');
        $totalToDeduct = round($amount + $commission, 2);

        if ($wallet->balance < $totalToDeduct) {
            return response()->json(['message' => 'Недостаточно средств'], 400);
        }

        // Дневной лимит вывода зависит от уровня защиты аккаунта:
        // 2FA — без лимита, иначе — $1000/день (e-mail всегда подтверждён при регистрации).
        $dailyLimit = $user->two_factor_confirmed_at ? null : 1000;

        if ($dailyLimit !== null) {
            // Лимит считаем по сумме самого вывода (без комиссии): поле amount
            // хранит чистую сумму вывода, а total_usd — списание вместе с комиссией.
            $withdrawnToday = (float) Transaction::where('user_id', $user->id)
                ->where('type', 'withdraw')
                ->whereDate('created_at', today())
                ->sum('amount');

            if ($withdrawnToday + $amount > $dailyLimit) {
                $remaining = max(0, $dailyLimit - $withdrawnToday);

                return response()->json([
                    'message' => "Превышен дневной лимит вывода (\${$dailyLimit}/день). "
                        . "Доступно сегодня: \${$remaining}. Включите 2FA, чтобы снять лимит.",
                    'daily_limit' => $dailyLimit,
                    'withdrawn_today' => $withdrawnToday,
                    'remaining_today' => $remaining,
                ], 403);
            }
        }

        DB::beginTransaction();
        try {
            $wallet->balance -= $totalToDeduct;
            $wallet->save();

            // Создаём транзакцию без asset_id (для фиатных операций).
            // amount — чистая сумма вывода, total_usd — фактическое списание с учётом комиссии.
            Transaction::create([
                'user_id' => $user->id,
                'asset_id' => null,
                'type' => 'withdraw',
                'status' => 'completed',
                'amount' => $amount,
                'price_usd' => 1,
                'total_usd' => $totalToDeduct,
                'fee' => $commission,
                'description' => 'Вывод средств из кошелька',
            ]);

            // Комиссия идёт на счёт платформы.
            $fees->creditPlatform($commission);

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
