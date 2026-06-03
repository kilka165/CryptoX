<?php

namespace App\Mail\Transport;

use Illuminate\Support\Facades\Http;
use Symfony\Component\Mailer\SentMessage;
use Symfony\Component\Mailer\Transport\AbstractTransport;
use Symfony\Component\Mime\Address;
use Symfony\Component\Mime\MessageConverter;

/**
 * Отправка писем через HTTP API Brevo (порт 443).
 * Нужен там, где хостинг блокирует исходящие SMTP-порты (например, Railway).
 */
class BrevoApiTransport extends AbstractTransport
{
    private const ENDPOINT = 'https://api.brevo.com/v3/smtp/email';

    public function __construct(private string $apiKey)
    {
        parent::__construct();
    }

    protected function doSend(SentMessage $message): void
    {
        $email = MessageConverter::toEmail($message->getOriginalMessage());

        $from = $email->getFrom()[0] ?? null;

        $payload = [
            'sender' => array_filter([
                'email' => $from?->getAddress(),
                'name' => $from?->getName() ?: null,
            ]),
            'to' => $this->mapAddresses($email->getTo()),
            'subject' => $email->getSubject(),
            'htmlContent' => $email->getHtmlBody() ?: ($email->getTextBody() ?? ''),
        ];

        if ($text = $email->getTextBody()) {
            $payload['textContent'] = $text;
        }
        if ($cc = $this->mapAddresses($email->getCc())) {
            $payload['cc'] = $cc;
        }
        if ($bcc = $this->mapAddresses($email->getBcc())) {
            $payload['bcc'] = $bcc;
        }
        if ($replyTo = $email->getReplyTo()[0] ?? null) {
            $payload['replyTo'] = array_filter([
                'email' => $replyTo->getAddress(),
                'name' => $replyTo->getName() ?: null,
            ]);
        }

        $response = Http::withHeaders([
            'api-key' => $this->apiKey,
            'accept' => 'application/json',
            'content-type' => 'application/json',
        ])->timeout(15)->post(self::ENDPOINT, $payload);

        if ($response->failed()) {
            throw new \RuntimeException(
                'Brevo API send failed ('.$response->status().'): '.$response->body()
            );
        }
    }

    /**
     * @param  array<int, Address>  $addresses
     * @return array<int, array{email: string, name?: string}>
     */
    private function mapAddresses(array $addresses): array
    {
        return array_map(fn (Address $a) => array_filter([
            'email' => $a->getAddress(),
            'name' => $a->getName() ?: null,
        ]), $addresses);
    }

    public function __toString(): string
    {
        return 'brevo+api://api.brevo.com';
    }
}
