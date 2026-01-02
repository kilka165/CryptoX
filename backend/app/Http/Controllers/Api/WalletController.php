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

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'deposit',
                'coin' => null, // ← ДОБАВЬТЕ
                'amount' => $validated['amount'],
                'price_usd' => 1,
                'total_usd' => $validated['amount'],
                // УДАЛИТЕ asset_id, status, description
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Пополнение успешно',
                'new_balance' => $wallet->balance,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ошибка при пополнении: ' . $e->getMessage()
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

        DB::beginTransaction();
        try {
            $wallet->balance -= $validated['amount'];
            $wallet->save();

            Transaction::create([
                'user_id' => $user->id,
                'type' => 'withdraw',
                'coin' => null, // ← ДОБАВЬТЕ
                'amount' => $validated['amount'],
                'price_usd' => 1,
                'total_usd' => $validated['amount'],
                // УДАЛИТЕ asset_id, status, description
            ]);

            DB::commit();

            return response()->json([
                'message' => 'Вывод успешен',
                'new_balance' => $wallet->balance,
            ]);
        } catch (\Exception $e) {
            DB::rollBack();
            return response()->json([
                'message' => 'Ошибка при выводе: ' . $e->getMessage()
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
