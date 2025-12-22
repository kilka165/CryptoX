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
        Schema::create('assets', function (Blueprint $table) {
            $table->id();
            $table->foreignId('user_id')->constrained()->onDelete('cascade');
            $table->string('symbol'); // Например: BTC, ETH
            $table->string('name');   // Например: Bitcoin
            $table->decimal('amount', 18, 8); // Количество (до 8 знаков после запятой)
            $table->timestamps();
            
            // Защита от дублей: у юзера может быть только одна запись про BTC
            $table->unique(['user_id', 'symbol']);
        });
    }


    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('assets');
    }
};
