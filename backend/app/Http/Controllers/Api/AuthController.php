<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Services\TwoFactorService;
use App\Services\VerificationCodeService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function __construct(
        private VerificationCodeService $codes,
        private TwoFactorService $twoFactor,
    ) {}

    // ========================================================
    // РЕГИСТРАЦИЯ / ВХОД / ВЫХОД
    // ========================================================

    public function register(Request $request)
    {
        // unique:users НЕ ставим: уникальность проверяем вручную, чтобы заброшенная
        // неподтверждённая регистрация не блокировала повторную попытку.
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255',
            'password' => 'required|string|min:8',
        ]);

        $existing = User::where('email', $validated['email'])->first();

        if ($existing && $existing->email_verified_at) {
            // E-mail уже занят подтверждённым аккаунтом.
            throw ValidationException::withMessages([
                'email' => ['Пользователь с таким e-mail уже зарегистрирован'],
            ]);
        }

        if ($existing) {
            // Заброшенная неподтверждённая регистрация — переиспользуем строку,
            // обновляя имя и пароль на свежие значения.
            $existing->name = $validated['name'];
            $existing->password = Hash::make($validated['password']);
            $existing->save();
            $user = $existing;
        } else {
            $user = User::create([
                'name' => $validated['name'],
                'email' => $validated['email'],
                'password' => Hash::make($validated['password']),
            ]);
        }

        // Токен НЕ выдаём — сначала пользователь должен подтвердить e-mail кодом.
        if ($this->codes->canIssue($user->email, VerificationCodeService::PURPOSE_EMAIL)) {
            $this->codes->issue($user->email, VerificationCodeService::PURPOSE_EMAIL);
        }

        return response()->json([
            'message' => 'Мы отправили код подтверждения на ваш e-mail',
            'verification_required' => true,
            'email' => $user->email,
        ], 201);
    }

    public function login(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        $user = User::where('email', $fields['email'])->first();

        if (! $user || ! Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'message' => 'Неверный email или пароль',
            ], 401);
        }

        // E-mail не подтверждён (заброшенная регистрация) — токен не выдаём,
        // повторно шлём код и просим фронт показать экран подтверждения.
        if (! $user->email_verified_at) {
            if ($this->codes->canIssue($user->email, VerificationCodeService::PURPOSE_EMAIL)) {
                $this->codes->issue($user->email, VerificationCodeService::PURPOSE_EMAIL);
            }

            return response()->json([
                'verification_required' => true,
            ], 200);
        }

        // Если у пользователя включён 2FA — токен пока не выдаём,
        // фронт должен запросить TOTP-код и дернуть /login/2fa.
        if ($user->two_factor_confirmed_at) {
            return response()->json([
                'two_factor' => true,
            ], 200);
        }

        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    /**
     * Второй шаг входа для пользователей с 2FA: e-mail + пароль + TOTP/recovery-код.
     */
    public function twoFactorChallenge(Request $request)
    {
        $fields = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
            'code' => 'required|string',
        ]);

        $user = User::where('email', $fields['email'])->first();

        if (! $user || ! Hash::check($fields['password'], $user->password)) {
            return response()->json(['message' => 'Неверный email или пароль'], 401);
        }

        if (! $user->two_factor_confirmed_at || ! $user->two_factor_secret) {
            return response()->json(['message' => '2FA не активирован'], 422);
        }

        $code = trim($fields['code']);

        // Сначала пробуем как обычный TOTP-код.
        if ($this->twoFactor->verify($user->two_factor_secret, $code)) {
            return $this->issueToken($user);
        }

        // Иначе — как одноразовый recovery-код.
        $remaining = $this->twoFactor->consumeRecoveryCode(
            $user->two_factor_recovery_codes ?? [],
            $code,
        );

        if ($remaining !== null) {
            $user->two_factor_recovery_codes = $remaining;
            $user->save();

            return $this->issueToken($user);
        }

        throw ValidationException::withMessages([
            'code' => ['Неверный код подтверждения'],
        ]);
    }

    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();

        return response()->json(['message' => 'Выход выполнен']);
    }

    // ========================================================
    // НАСТРОЙКИ ПРОФИЛЯ
    // ========================================================

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'currency' => 'required|string|size:3',
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json(['message' => 'Настройки сохранены', 'user' => $user]);
    }

    // ========================================================
    // ВЕРИФИКАЦИЯ E-MAIL
    // ========================================================

    public function sendVerificationCode(Request $request)
    {
        $user = $request->user();

        if ($user->email_verified_at) {
            return response()->json(['message' => 'E-mail уже подтверждён', 'already_verified' => true]);
        }

        if (! $this->codes->canIssue($user->email, VerificationCodeService::PURPOSE_EMAIL)) {
            return response()->json([
                'message' => 'Код уже отправлен. Подождите минуту перед повторной отправкой.',
            ], 429);
        }

        $this->codes->issue($user->email, VerificationCodeService::PURPOSE_EMAIL);

        return response()->json(['message' => 'Код отправлен на ваш e-mail']);
    }

    public function verifyEmail(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
        ]);

        $user = $request->user();

        if ($user->email_verified_at) {
            return response()->json(['message' => 'E-mail уже подтверждён', 'already_verified' => true]);
        }

        if (! $this->codes->verify($user->email, VerificationCodeService::PURPOSE_EMAIL, trim($validated['code']))) {
            throw ValidationException::withMessages([
                'code' => ['Неверный или просроченный код'],
            ]);
        }

        $user->email_verified_at = now();
        $user->save();

        return response()->json(['message' => 'E-mail подтверждён', 'email_verified' => true]);
    }

    // ========================================================
    // ВЕРИФИКАЦИЯ РЕГИСТРАЦИИ (публичная, без токена)
    // ========================================================

    /**
     * Подтверждение e-mail при регистрации по коду. При успехе сразу
     * выдаём токен (автологин) — код из письма доказывает владение e-mail.
     */
    public function verifyRegistration(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'code' => 'required|string',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if (! $user || ! $this->codes->verify($user->email, VerificationCodeService::PURPOSE_EMAIL, trim($validated['code']))) {
            throw ValidationException::withMessages([
                'code' => ['Неверный или просроченный код'],
            ]);
        }

        if (! $user->email_verified_at) {
            $user->email_verified_at = now();
            $user->save();
        }

        return $this->issueToken($user);
    }

    /**
     * Повторная отправка кода подтверждения регистрации.
     * Ответ всегда одинаковый — чтобы не раскрывать наличие e-mail.
     */
    public function resendRegistrationCode(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
        ]);

        $user = User::where('email', $validated['email'])->first();

        if ($user && ! $user->email_verified_at
            && $this->codes->canIssue($user->email, VerificationCodeService::PURPOSE_EMAIL)) {
            $this->codes->issue($user->email, VerificationCodeService::PURPOSE_EMAIL);
        }

        return response()->json([
            'message' => 'Если регистрация ещё не подтверждена, мы повторно отправили код на e-mail.',
        ]);
    }

    // ========================================================
    // ВОССТАНОВЛЕНИЕ ПАРОЛЯ
    // ========================================================

    public function forgotPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
        ]);

        $user = User::where('email', $validated['email'])->first();

        // Шлём код только если пользователь существует и не нарушаем антиспам,
        // но ответ всегда одинаковый — чтобы не раскрывать наличие e-mail.
        if ($user && $this->codes->canIssue($user->email, VerificationCodeService::PURPOSE_RESET)) {
            $this->codes->issue($user->email, VerificationCodeService::PURPOSE_RESET);
        }

        return response()->json([
            'message' => 'Если такой e-mail зарегистрирован, мы отправили на него код для сброса пароля.',
        ]);
    }

    public function resetPassword(Request $request)
    {
        $validated = $request->validate([
            'email' => 'required|string|email',
            'code' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        if (! $this->codes->verify($validated['email'], VerificationCodeService::PURPOSE_RESET, trim($validated['code']))) {
            throw ValidationException::withMessages([
                'code' => ['Неверный или просроченный код'],
            ]);
        }

        $user = User::where('email', $validated['email'])->first();

        if (! $user) {
            throw ValidationException::withMessages([
                'email' => ['Пользователь не найден'],
            ]);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        // Сбрасываем все активные сессии/токены ради безопасности.
        $user->tokens()->delete();

        return response()->json(['message' => 'Пароль успешно изменён. Войдите с новым паролем.']);
    }

    public function changePassword(Request $request)
    {
        $validated = $request->validate([
            'current_password' => 'required|string',
            'password' => 'required|string|min:8',
        ]);

        $user = $request->user();

        if (! Hash::check($validated['current_password'], $user->password)) {
            throw ValidationException::withMessages([
                'current_password' => ['Текущий пароль указан неверно'],
            ]);
        }

        $user->password = Hash::make($validated['password']);
        $user->save();

        return response()->json(['message' => 'Пароль изменён']);
    }

    // ========================================================
    // 2FA (TOTP / Google Authenticator)
    // ========================================================

    public function enableTwoFactor(Request $request)
    {
        $user = $request->user();

        // 2FA доступен только после подтверждения e-mail.
        if (! $user->email_verified_at) {
            return response()->json([
                'message' => 'Сначала подтвердите e-mail, чтобы включить 2FA',
                'email_verified' => false,
            ], 403);
        }

        if ($user->two_factor_confirmed_at) {
            return response()->json(['message' => '2FA уже включён'], 422);
        }

        $secret = $this->twoFactor->generateSecret();
        $user->two_factor_secret = $secret;
        $user->two_factor_recovery_codes = null;
        $user->two_factor_confirmed_at = null;
        $user->save();

        return response()->json([
            'secret' => $secret,
            'otpauth_url' => $this->twoFactor->otpauthUrl($user->email, $secret),
        ]);
    }

    public function confirmTwoFactor(Request $request)
    {
        $validated = $request->validate([
            'code' => 'required|string',
        ]);

        $user = $request->user();

        if (! $user->two_factor_secret) {
            return response()->json(['message' => 'Сначала включите 2FA'], 422);
        }

        if ($user->two_factor_confirmed_at) {
            return response()->json(['message' => '2FA уже подтверждён'], 422);
        }

        if (! $this->twoFactor->verify($user->two_factor_secret, trim($validated['code']))) {
            throw ValidationException::withMessages([
                'code' => ['Неверный код из приложения'],
            ]);
        }

        $recoveryCodes = $this->twoFactor->generateRecoveryCodes();

        $user->two_factor_recovery_codes = $this->twoFactor->hashRecoveryCodes($recoveryCodes);
        $user->two_factor_confirmed_at = now();
        $user->save();

        return response()->json([
            'message' => '2FA включён',
            'recovery_codes' => $recoveryCodes, // показываем один раз
        ]);
    }

    public function disableTwoFactor(Request $request)
    {
        $validated = $request->validate([
            'password' => 'required|string',
        ]);

        $user = $request->user();

        if (! Hash::check($validated['password'], $user->password)) {
            throw ValidationException::withMessages([
                'password' => ['Пароль указан неверно'],
            ]);
        }

        $user->two_factor_secret = null;
        $user->two_factor_recovery_codes = null;
        $user->two_factor_confirmed_at = null;
        $user->save();

        return response()->json(['message' => '2FA отключён']);
    }

    // ========================================================
    // ВСПОМОГАТЕЛЬНОЕ
    // ========================================================

    private function issueToken(User $user)
    {
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 200);
    }
}
