<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Удержанная комиссия в USD. 0 — для операций без комиссии (deposit).
            $table->decimal('fee', 20, 8)->default(0)->after('total_usd');
        });
    }

    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            $table->dropColumn('fee');
        });
    }
};
