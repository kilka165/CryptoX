<?php

namespace App\Services;

use PragmaRX\Google2FA\Google2FA;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Str;

class TwoFactorService
{
    private Google2FA $engine;

    public function __construct()
    {
        $this->engine = new Google2FA();
    }

    /** Новый секрет для пользователя. */
    public function generateSecret(): string
    {
        return $this->engine->generateSecretKey();
    }

    /** otpauth://-ссылка, из которой фронт рисует QR-код. */
    public function otpauthUrl(string $email, string $secret): string
    {
        return $this->engine->getQRCodeUrl(
            (string) config('app.name', 'CryptoX'),
            $email,
            $secret,
        );
    }

    /** Проверка 6-значного TOTP-кода (с окном ±1 интервал для рассинхрона часов). */
    public function verify(string $secret, string $code): bool
    {
        return (bool) $this->engine->verifyKey($secret, $code);
    }

    /**
     * Сгенерировать набор одноразовых recovery-кодов (открытый вид — показать пользователю один раз).
     *
     * @return array<int, string>
     */
    public function generateRecoveryCodes(int $count = 8): array
    {
        return collect(range(1, $count))
            ->map(fn () => strtoupper(Str::random(5)) . '-' . strtoupper(Str::random(5)))
            ->all();
    }

    /**
     * Захешировать recovery-коды для хранения.
     *
     * @param  array<int, string>  $codes
     * @return array<int, string>
     */
    public function hashRecoveryCodes(array $codes): array
    {
        return array_map(fn (string $code) => Hash::make($code), $codes);
    }

    /**
     * Попытаться использовать recovery-код. Возвращает оставшиеся хеши без использованного,
     * либо null, если код не подошёл.
     *
     * @param  array<int, string>  $hashedCodes
     * @return array<int, string>|null
     */
    public function consumeRecoveryCode(array $hashedCodes, string $input): ?array
    {
        foreach ($hashedCodes as $index => $hash) {
            if (Hash::check($input, $hash)) {
                unset($hashedCodes[$index]);

                return array_values($hashedCodes);
            }
        }

        return null;
    }
}
