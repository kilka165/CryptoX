<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;

class AssetController extends Controller
{
    /**
     * Получить список всех уникальных криптовалют
     * Используется для фильтров в P2P (публичный доступ)
     */
    public function index(Request $request)
    {
        try {
            // Получаем уникальные криптовалюты из таблицы assets
            $assets = Asset::select('name', 'symbol')
                ->distinct()
                ->whereNotNull('name')
                ->whereNotNull('symbol')
                ->orderBy('name')
                ->get();

            // Если в базе нет данных, возвращаем популярные монеты
            if ($assets->isEmpty()) {
                $defaultAssets = [
                    ['name' => 'bitcoin', 'symbol' => 'BTC'],
                    ['name' => 'ethereum', 'symbol' => 'ETH'],
                    ['name' => 'dogecoin', 'symbol' => 'DOGE'],
                    ['name' => 'ripple', 'symbol' => 'XRP'],
                    ['name' => 'cardano', 'symbol' => 'ADA'],
                    ['name' => 'solana', 'symbol' => 'SOL'],
                    ['name' => 'polkadot', 'symbol' => 'DOT'],
                    ['name' => 'binancecoin', 'symbol' => 'BNB'],
                    ['name' => 'tether', 'symbol' => 'USDT'],
                    ['name' => 'usd-coin', 'symbol' => 'USDC'],
                ];

                return response()->json($defaultAssets);
            }

            return response()->json($assets);

        } catch (\Exception $e) {
            Log::error('Error fetching assets', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            // Возвращаем дефолтные даже при ошибке
            return response()->json([
                ['name' => 'bitcoin', 'symbol' => 'BTC'],
                ['name' => 'ethereum', 'symbol' => 'ETH'],
                ['name' => 'dogecoin', 'symbol' => 'DOGE'],
            ]);
        }
    }
    

    /**
     * Получить активы конкретного пользователя (требует авторизации)
     */
    public function userAssets(Request $request)
    {
        try {
            $user = auth()->user();

            if (!$user) {
                return response()->json([
                    'message' => 'Unauthorized'
                ], 401);
            }

            $assets = Asset::where('user_id', $user->id)
                ->where('amount', '>', 0)
                ->orderBy('amount', 'desc')
                ->get();

            return response()->json($assets);

        } catch (\Exception $e) {
            Log::error('Error fetching user assets', [
                'error' => $e->getMessage(),
                'user_id' => auth()->id()
            ]);

            return response()->json([
                'message' => 'Error fetching user assets',
                'error' => $e->getMessage()
            ], 500);
        }
    }
}
