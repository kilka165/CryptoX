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
            $table->foreignId('asset_id')->nullable()->constrained()->onDelete('set null');
            $table->enum('type', ['buy', 'sell', 'deposit', 'withdraw']);
            $table->string('coin')->nullable();
            $table->decimal('amount', 20, 8);
            $table->decimal('price_usd', 20, 8)->nullable();
            $table->decimal('total_usd', 20, 8);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('transactions');
    }
};
