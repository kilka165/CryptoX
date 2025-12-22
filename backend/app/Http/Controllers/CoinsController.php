<?php

namespace App\Http\Controllers;

use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Cache;

class CoinsController extends Controller
{
    // Получить все монеты с иконками
    public function index()
    {
        try {
            $coins = Http::withoutVerifying()
                ->get('https://api.coingecko.com/api/v3/coins/markets', [
                    'vs_currency' => 'usd',
                    'order' => 'market_cap_desc',
                    'per_page' => 250,
                    'sparkline' => false,
                ])
                ->json();

            // Сохраняем иконки в БД
            foreach ($coins as $coin) {
                Asset::firstOrCreate(
                    ['name' => $coin['id']],
                    [
                        'symbol' => strtoupper($coin['symbol']),
                        'amount' => 0,
                        'icon_url' => $coin['image']['small'] ?? null,
                        'logo_url' => $coin['image']['large'] ?? null,
                    ]
                );
            }

            return response()->json([
                'message' => 'Иконки успешно сохранены',
                'count' => count($coins),
            ]);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Получить монету с иконкой по ID
    public function show($coinId)
    {
        try {
            // Кешируем на 1 час
            $coin = Cache::remember("coin_{$coinId}", 3600, function () use ($coinId) {
                $data = Http::withoutVerifying()
                    ->get("https://api.coingecko.com/api/v3/coins/{$coinId}")
                    ->json();

                // Сохраняем в БД
                Asset::updateOrCreate(
                    ['name' => $coinId],
                    [
                        'symbol' => strtoupper($data['symbol'] ?? ''),
                        'icon_url' => $data['image']['small'] ?? null,
                        'logo_url' => $data['image']['large'] ?? null,
                    ]
                );

                return $data;
            });

            return response()->json($coin);
        } catch (\Exception $e) {
            return response()->json(['error' => $e->getMessage()], 500);
        }
    }

    // Получить все монеты из БД
    public function fromDatabase()
    {
        $assets = Asset::all(['name', 'symbol', 'icon_url', 'logo_url']);
        return response()->json($assets);
    }

    // Получить иконку конкретной монеты из БД
    public function getCoinIcon($coinId)
    {
        $asset = Asset::where('name', $coinId)->first();

        if (!$asset || !$asset->icon_url) {
            return response()->json(['error' => 'Icon not found'], 404);
        }

        return response()->json([
            'id' => $asset->name,
            'symbol' => $asset->symbol,
            'icon_url' => $asset->icon_url,
            'logo_url' => $asset->logo_url,
        ]);
    }
}
