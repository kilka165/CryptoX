<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        // Создаём таблицу заявок P2P
        Schema::create('p2p_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->string('crypto_currency', 50);
            $table->string('currency', 10);
            $table->decimal('price', 20, 2);
            $table->decimal('min_limit', 20, 2);
            $table->decimal('max_limit', 20, 2);
            $table->decimal('available_amount', 20, 8);
            $table->enum('type', ['buy', 'sell'])->default('sell');
            $table->boolean('is_active')->default(true);
            $table->timestamps();

            // Индексы
            $table->index(['crypto_currency', 'currency', 'type']);
            $table->index('is_active');
        });

        // Создаём таблицу сделок P2P
        Schema::create('p2p_trades', function (Blueprint $table) {
             $table->id();
            $table->foreignId('offer_id')->constrained('p2p_offers')->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->decimal('crypto_amount', 20, 8)->comment('Количество криптовалюты');
            $table->decimal('amount', 20, 2)->comment('Общая сумма в фиатной валюте');
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();

            // Индексы для быстрой выборки
            $table->index(['buyer_id', 'status']);
            $table->index('status');
            $table->index('created_at');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('p2p_trades');
        Schema::dropIfExists('p2p_offers');
    }
};
