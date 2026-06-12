<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Аватар храним прямо в БД как data URL (base64). Это переживает
     * редеплои на Railway с эфемерной файловой системой и не требует
     * storage:link / S3. Картинка ужимается на клиенте до ~256px.
     */
    public function up(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->longText('avatar')->nullable()->after('currency');
        });
    }

    public function down(): void
    {
        Schema::table('users', function (Blueprint $table) {
            $table->dropColumn('avatar');
        });
    }
};
