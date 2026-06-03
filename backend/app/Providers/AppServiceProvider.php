<?php

namespace App\Providers;

use App\Mail\Transport\BrevoApiTransport;
use Illuminate\Support\ServiceProvider;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Schema;

class AppServiceProvider extends ServiceProvider
{
    /**
     * Register any application services.
     */
    public function register(): void
    {
        //
    }

    /**
     * Bootstrap any application services.
     */
    public function boot(): void
    {
        Schema::defaultStringLength(191);

        // Кастомный mailer 'brevo' — отправка через HTTP API Brevo (порт 443),
        // т.к. Railway блокирует SMTP-порты. Включается через MAIL_MAILER=brevo.
        Mail::extend('brevo', function (array $config) {
            return new BrevoApiTransport($config['key'] ?? (string) config('services.brevo.key'));
        });
    }
}
