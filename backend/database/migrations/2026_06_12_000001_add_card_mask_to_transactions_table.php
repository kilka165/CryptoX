<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Маска карты для пополнений/выводов: 3333********3333.
            // Полный номер карты не хранится — фронт присылает уже маскированный.
            $table->string('card_mask')->nullable()->after('description');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('card_mask');
        });
    }
};
