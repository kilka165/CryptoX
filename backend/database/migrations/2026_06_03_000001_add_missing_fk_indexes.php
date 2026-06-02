<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * PostgreSQL (в отличие от MySQL) НЕ создаёт индекс автоматически под внешний
     * ключ. Эти колонки часто используются в WHERE/JOIN, поэтому добавляем индексы
     * явно. (assets.user_id покрыт unique(user_id,name); transactions.user_id —
     * составным (user_id,type); staking.user_id — составным (user_id,status).)
     */
    public function up(): void
    {
        Schema::table('wallets', function (Blueprint $table) {
            $table->index('user_id');
        });

        Schema::table('p2p_offers', function (Blueprint $table) {
            $table->index('seller_id');
        });

        Schema::table('p2p_trades', function (Blueprint $table) {
            $table->index('offer_id');
        });
    }

    public function down(): void
    {
        Schema::table('wallets', function (Blueprint $table) {
            $table->dropIndex(['user_id']);
        });

        Schema::table('p2p_offers', function (Blueprint $table) {
            $table->dropIndex(['seller_id']);
        });

        Schema::table('p2p_trades', function (Blueprint $table) {
            $table->dropIndex(['offer_id']);
        });
    }
};
