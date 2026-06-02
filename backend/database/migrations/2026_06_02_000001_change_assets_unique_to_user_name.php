<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * symbol выводится как strtoupper(substr(name, 0, 3)) и совпадает у разных
     * монет (bitcoin/bitcoin-cash → BIT, ethereum/ethereum-classic → ETH),
     * из-за чего unique(user_id, symbol) ронял вторую покупку. Идентичность
     * актива у пользователя — это (user_id, name), поэтому переносим
     * уникальность на name (именно по name работает firstOrCreate в коде).
     */
    public function up(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'symbol']);
            $table->unique(['user_id', 'name']);
        });
    }

    public function down(): void
    {
        Schema::table('assets', function (Blueprint $table) {
            $table->dropUnique(['user_id', 'name']);
            $table->unique(['user_id', 'symbol']);
        });
    }
};
