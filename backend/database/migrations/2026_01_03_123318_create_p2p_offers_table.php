<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('p2p_offers', function (Blueprint $table) {
            $table->id();
            $table->foreignId('seller_id')->constrained('users')->onDelete('cascade');
            $table->string('crypto_currency');
            $table->string('currency');
            $table->decimal('price', 20, 2);
            $table->decimal('min_limit', 20, 2);
            $table->decimal('max_limit', 20, 2);
            $table->decimal('available_amount', 20, 8);
            $table->enum('type', ['buy', 'sell'])->default('sell');
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('p2p_trades', function (Blueprint $table) {
            $table->id();
            $table->foreignId('offer_id')->constrained('p2p_offers')->onDelete('cascade');
            $table->foreignId('buyer_id')->constrained('users')->onDelete('cascade');
            $table->decimal('amount', 20, 2);
            $table->decimal('crypto_amount', 20, 8); 
            $table->enum('status', ['pending', 'completed', 'cancelled'])->default('pending');
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('p2p_trades');
        Schema::dropIfExists('p2p_offers');
    }
};
