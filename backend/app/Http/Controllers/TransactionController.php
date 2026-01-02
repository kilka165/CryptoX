<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use Illuminate\Http\Request;


class TransactionController extends Controller
{

    public function getHistory(Request $request)
    {
        $query = Transaction::with(['asset']) // загружаем связь asset
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc');

        // Фильтры...
        if ($request->type && $request->type !== 'all') {
            $query->where('type', $request->type);
        }

        if ($request->search) {
            $query->where('description', 'like', '%' . $request->search . '%');
        }

        $transactions = $query->paginate(10);

        return response()->json($transactions);
    }


    // Метод getStats добавь аналогично с проверкой if (!$user)
    public function getStats(Request $request)
    {
        $user = $request->user();

        // ✅ ПРОВЕРКА ПОЛЬЗОВАТЕЛЯ
        if (!$user) {
             return response()->json(['message' => 'Unauthorized'], 401);
        }

        $totalBuys = Transaction::where('user_id', $user->id)
            ->where('type', 'buy')
            ->sum('total_usd');

        $totalSells = Transaction::where('user_id', $user->id)
            ->where('type', 'sell')
            ->sum('total_usd');

        return response()->json([
            'total_buys_usd' => $totalBuys,
            'total_sells_usd' => $totalSells,
        ]);
    }
}
