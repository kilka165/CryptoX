<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Снимок последних известных цен монет.
     * Обновляется при каждом обновлении списка Binance (CoinsController).
     * Нужен как fallback: если монета выпала из топ-300 живого списка
     * (или Binance недоступен), цена в активах берётся отсюда, а не обнуляется.
     */
    public function up(): void
    {
        Schema::create('coin_prices', function (Blueprint $table) {
            $table->id();
            $table->string('coin_id')->unique();   // id монеты (равен Asset.name)
            $table->string('symbol')->index();     // тикер в нижнем регистре
            $table->string('name')->nullable();
            $table->string('image')->nullable();
            $table->double('price')->default(0);                // последняя цена в USD
            $table->double('price_change_24h')->default(0);     // изменение за 24ч, %
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('coin_prices');
    }
};
