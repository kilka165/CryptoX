<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

/**
 * Последняя известная цена монеты (снимок Binance).
 * Используется как fallback, когда монета выпала из живого топ-300
 * списка или Binance временно недоступен — чтобы цена в активах
 * пользователя не обнулялась. См. CoinsController::persistPrices().
 */
class CoinPrice extends Model
{
    protected $fillable = [
        'coin_id',
        'symbol',
        'name',
        'image',
        'price',
        'price_change_24h',
    ];

    protected $casts = [
        'price' => 'float',
        'price_change_24h' => 'float',
    ];
}
