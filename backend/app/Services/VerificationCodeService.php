<?php

namespace App\Services;

use App\Mail\VerificationCodeMail;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class VerificationCodeService
{
    public const PURPOSE_EMAIL = 'email_verification';
    public const PURPOSE_RESET = 'password_reset';

    /** Сколько секунд должно пройти между двумя отправками кода на один e-mail. */
    private const RESEND_THROTTLE_SECONDS = 60;

    /** Срок жизни кода в минутах. */
    private const TTL_MINUTES = 15;

    /**
     * Можно ли сейчас выслать новый код (антиспам по последней отправке).
     */
    public function canIssue(string $email, string $purpose): bool
    {
        $last = DB::table('verification_codes')
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->orderByDesc('created_at')
            ->first();

        if (! $last) {
            return true;
        }

        return Carbon::parse($last->created_at)->addSeconds(self::RESEND_THROTTLE_SECONDS)->isPast();
    }

    /**
     * Сгенерировать код, сохранить его хеш и отправить письмо.
     * Старые коды того же назначения удаляются.
     */
    public function issue(string $email, string $purpose): void
    {
        $code = (string) random_int(100000, 999999);

        DB::table('verification_codes')
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->delete();

        DB::table('verification_codes')->insert([
            'email' => $email,
            'code_hash' => Hash::make($code),
            'purpose' => $purpose,
            'expires_at' => now()->addMinutes(self::TTL_MINUTES),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        Mail::to($email)->send(new VerificationCodeMail($code, $purpose));
    }

    /**
     * Проверить код. При успехе запись удаляется (одноразовость).
     */
    public function verify(string $email, string $purpose, string $code): bool
    {
        $record = DB::table('verification_codes')
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->where('expires_at', '>', now())
            ->orderByDesc('created_at')
            ->first();

        if (! $record || ! Hash::check($code, $record->code_hash)) {
            return false;
        }

        DB::table('verification_codes')
            ->where('email', $email)
            ->where('purpose', $purpose)
            ->delete();

        return true;
    }
}
