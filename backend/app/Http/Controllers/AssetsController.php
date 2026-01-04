<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Asset;

class AssetsController extends Controller
{
    public function index(Request $request)
    {
        $user = $request->user();

        // Получаем активы пользователя с группировкой
        $assets = Asset::where('user_id', $user->id)
            ->selectRaw('coin_id, coin_symbol as symbol, coin_name as name, SUM(amount) as amount')
            ->groupBy('coin_id', 'coin_symbol', 'coin_name')
            ->having('amount', '>', 0)
            ->get();

        return response()->json($assets);
    }

    // 🔥 Получить уникальные криптовалюты
    public function getAvailableCryptos(Request $request)
    {
        $user = $request->user();

        $cryptos = Asset::where('user_id', $user->id)
            ->selectRaw('DISTINCT coin_name as name, coin_symbol as symbol')
            ->having('amount', '>', 0)
            ->get();

        return response()->json($cryptos->pluck('name'));
    }
}
