<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('staking', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('crypto_currency', 50);
            $table->decimal('amount', 20, 8)->comment('Застейканная сумма');
            $table->decimal('reward_rate', 5, 2)->comment('Процентная ставка годовых');
            $table->decimal('earned_rewards', 20, 8)->default(0)->comment('Заработанные награды');
            $table->enum('status', ['active', 'completed', 'cancelled'])->default('active');
            $table->integer('lock_period_days')->comment('Период блокировки в днях');
            $table->timestamp('started_at')->nullable();
            $table->timestamp('ends_at')->nullable();
            $table->timestamp('claimed_at')->nullable();
            $table->timestamps();

            // Индексы
            $table->index(['user_id', 'status']);
            $table->index('crypto_currency');
            $table->index('ends_at');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('staking');
    }
};
