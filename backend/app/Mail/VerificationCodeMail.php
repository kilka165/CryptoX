<?php

namespace App\Mail;

use Illuminate\Bus\Queueable;
use Illuminate\Mail\Mailable;
use Illuminate\Mail\Mailables\Content;
use Illuminate\Mail\Mailables\Envelope;
use Illuminate\Queue\SerializesModels;

class VerificationCodeMail extends Mailable
{
    use Queueable, SerializesModels;

    /**
     * @param  string  $code      6-значный код
     * @param  string  $purpose   email_verification | password_reset
     */
    public function __construct(
        public string $code,
        public string $purpose,
    ) {}

    public function envelope(): Envelope
    {
        $subject = $this->purpose === 'password_reset'
            ? 'CryptoX — код для сброса пароля'
            : 'CryptoX — код подтверждения e-mail';

        return new Envelope(subject: $subject);
    }

    public function content(): Content
    {
        return new Content(
            markdown: 'emails.verification-code',
            with: [
                'code' => $this->code,
                'purpose' => $this->purpose,
            ],
        );
    }
}
