<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('transactions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->foreignId('asset_id')->nullable()->constrained('assets')->onDelete('set null');
            $table->enum('type', ['buy', 'sell', 'deposit', 'withdraw']);
            $table->enum('status', ['completed', 'pending', 'failed'])->default('completed');
            $table->decimal('amount', 18, 8); // Количество крипты или USD
            $table->decimal('price_usd', 15, 2); // Цена в момент транзакции
            $table->decimal('total_usd', 15, 2); // Сумма в USD
            $table->string('description')->nullable();
            $table->timestamps();
            
            // Индексы для быстрого поиска
            $table->index('user_id');
            $table->index('type');
            $table->index('created_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
