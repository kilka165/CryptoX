<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Коды подтверждения для верификации e-mail и сброса пароля.
     * Код хранится в виде хеша; одна таблица обслуживает оба сценария.
     */
    public function up(): void
    {
        Schema::create('verification_codes', function (Blueprint $table) {
            $table->id();
            $table->string('email');
            $table->string('code_hash');
            $table->string('purpose'); // email_verification | password_reset
            $table->timestamp('expires_at');
            $table->timestamps();

            $table->index(['email', 'purpose']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('verification_codes');
    }
};
