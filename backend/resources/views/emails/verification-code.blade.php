@component('mail::message')
# {{ $purpose === 'password_reset' ? 'Сброс пароля' : 'Подтверждение e-mail' }}

@if ($purpose === 'password_reset')
Вы запросили сброс пароля в CryptoX. Введите код ниже, чтобы задать новый пароль:
@else
Чтобы подтвердить ваш e-mail в CryptoX, введите этот код:
@endif

@component('mail::panel')
# {{ $code }}
@endcomponent

Код действителен **15 минут**. Никому его не сообщайте.

Если вы не запрашивали это действие — просто проигнорируйте письмо, с аккаунтом ничего не произойдёт.

Спасибо,<br>
Команда {{ config('app.name') }}
@endcomponent
