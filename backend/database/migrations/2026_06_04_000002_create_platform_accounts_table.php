<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // Счёт платформы: сюда копятся все удержанные комиссии (по одной строке на валюту).
        Schema::create('platform_accounts', function (Blueprint $table) {
            $table->id();
            $table->string('currency')->unique()->default('USD');
            $table->decimal('balance', 20, 2)->default(0);
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('platform_accounts');
    }
};
