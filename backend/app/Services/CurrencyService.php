<?php

namespace App\Services;

use Illuminate\Support\Facades\Cache;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class CurrencyService
{
    private const CACHE_KEY = 'currency_rates_usd_base';
    private const CACHE_TTL = 3600; // 1 час

    /**
     * Получить курсы всех валют относительно USD.
     * Источник: exchangerate-api.com, кэшируется на 1 час (общий кэш на всех пользователей).
     * При недоступности API — возвращает захардкоженный fallback.
     */
    public function getRates(): array
    {
        return Cache::remember(self::CACHE_KEY, self::CACHE_TTL, function () {
            try {
                $response = Http::withOptions(['verify' => ! app()->isLocal()])
                    ->timeout(10)
                    ->get('https://api.exchangerate-api.com/v4/latest/USD');

                if ($response->successful()) {
                    $data = $response->json();
                    if (isset($data['rates']) && is_array($data['rates'])) {
                        return [
                            'rates' => $data['rates'],
                            'source' => 'live_api',
                            'fetched_at' => now()->toIso8601String(),
                        ];
                    }
                }

                Log::warning('Currency API returned unexpected payload', ['status' => $response->status()]);
            } catch (\Exception $e) {
                Log::error('Currency API fetch failed: ' . $e->getMessage());
            }

            return [
                'rates' => $this->getFallbackRates(),
                'source' => 'fallback',
                'fetched_at' => now()->toIso8601String(),
            ];
        });
    }

    /**
     * Курс валюты к USD (сколько единиц валюты в 1 USD).
     * USD → 1, любая неизвестная валюта → 1.
     */
    public function getRate(string $currency): float
    {
        $currency = strtoupper($currency);
        if ($currency === 'USD') {
            return 1.0;
        }

        $rates = $this->getRates()['rates'] ?? [];
        return (float) ($rates[$currency] ?? 1.0);
    }

    /**
     * Конвертация суммы между двумя валютами через USD-базу.
     */
    public function convert(float $amount, string $from, string $to): float
    {
        $from = strtoupper($from);
        $to = strtoupper($to);

        if ($from === $to) {
            return $amount;
        }

        $fromRate = $this->getRate($from);
        $toRate = $this->getRate($to);

        if ($fromRate <= 0) {
            return $amount;
        }

        return $amount * $toRate / $fromRate;
    }

    /**
     * Запасные курсы на случай отказа внешнего API.
     */
    private function getFallbackRates(): array
    {
        return [
            'AED' => 3.67, 'AFN' => 70.5, 'ALL' => 93.2, 'AMD' => 387.5, 'ANG' => 1.79,
            'AOA' => 825.0, 'ARS' => 830.0, 'AUD' => 1.52, 'AWG' => 1.79, 'AZN' => 1.7,
            'BAM' => 1.8, 'BBD' => 2.0, 'BDT' => 109.5, 'BGN' => 1.8, 'BHD' => 0.376,
            'BIF' => 2850.0, 'BMD' => 1.0, 'BND' => 1.35, 'BOB' => 6.91, 'BRL' => 4.97,
            'BSD' => 1.0, 'BTN' => 83.2, 'BWP' => 13.5, 'BYN' => 3.27, 'BZD' => 2.0,
            'CAD' => 1.35, 'CDF' => 2500.0, 'CHF' => 0.88, 'CLP' => 950.0, 'CNY' => 7.24,
            'COP' => 3950.0, 'CRC' => 520.0, 'CUP' => 24.0, 'CVE' => 101.5, 'CZK' => 22.8,
            'DJF' => 177.5, 'DKK' => 6.87, 'DOP' => 58.5, 'DZD' => 134.5, 'EGP' => 48.5,
            'ERN' => 15.0, 'ETB' => 110.0, 'EUR' => 0.92, 'FJD' => 2.25, 'FKP' => 0.79,
            'FOK' => 6.87, 'GBP' => 0.79, 'GEL' => 2.7, 'GGP' => 0.79, 'GHS' => 15.2,
            'GIP' => 0.79, 'GMD' => 67.5, 'GNF' => 8600.0, 'GTQ' => 7.75, 'GYD' => 209.0,
            'HKD' => 7.83, 'HNL' => 24.7, 'HRK' => 6.93, 'HTG' => 131.5, 'HUF' => 355.0,
            'IDR' => 15750.0, 'ILS' => 3.65, 'IMP' => 0.79, 'INR' => 83.2, 'IQD' => 1310.0,
            'IRR' => 42000.0, 'ISK' => 137.5, 'JEP' => 0.79, 'JMD' => 155.0, 'JOD' => 0.71,
            'JPY' => 150.0, 'KES' => 129.0, 'KGS' => 84.5, 'KHR' => 4050.0, 'KID' => 1.52,
            'KMF' => 452.5, 'KRW' => 1320.0, 'KWD' => 0.31, 'KYD' => 0.83, 'KZT' => 450.0,
            'LAK' => 21500.0, 'LBP' => 89500.0, 'LKR' => 297.0, 'LRD' => 185.0, 'LSL' => 18.2,
            'LYD' => 4.85, 'MAD' => 10.1, 'MDL' => 17.8, 'MGA' => 4450.0, 'MKD' => 56.5,
            'MMK' => 2100.0, 'MNT' => 3400.0, 'MOP' => 8.05, 'MRU' => 39.5, 'MUR' => 45.5,
            'MVR' => 15.4, 'MWK' => 1730.0, 'MXN' => 17.2, 'MYR' => 4.47, 'MZN' => 63.8,
            'NAD' => 18.2, 'NGN' => 1545.0, 'NIO' => 36.7, 'NOK' => 10.6, 'NPR' => 133.0,
            'NZD' => 1.63, 'OMR' => 0.385, 'PAB' => 1.0, 'PEN' => 3.75, 'PGK' => 3.95,
            'PHP' => 56.5, 'PKR' => 278.0, 'PLN' => 3.98, 'PYG' => 7650.0, 'QAR' => 3.64,
            'RON' => 4.58, 'RSD' => 107.8, 'RUB' => 90.0, 'RWF' => 1285.0, 'SAR' => 3.75,
            'SBD' => 8.5, 'SCR' => 13.7, 'SDG' => 600.0, 'SEK' => 10.4, 'SGD' => 1.35,
            'SHP' => 0.79, 'SLE' => 22.5, 'SLL' => 22500.0, 'SOS' => 571.0, 'SRD' => 35.3,
            'SSP' => 1300.0, 'STN' => 22.5, 'SYP' => 13000.0, 'SZL' => 18.2, 'THB' => 34.8,
            'TJS' => 10.95, 'TMT' => 3.5, 'TND' => 3.15, 'TOP' => 2.38, 'TRY' => 33.5,
            'TTD' => 6.78, 'TVD' => 1.52, 'TWD' => 31.5, 'TZS' => 2500.0, 'UAH' => 41.2,
            'UGX' => 3700.0, 'USD' => 1.0, 'UYU' => 39.2, 'UZS' => 12750.0, 'VES' => 36.5,
            'VND' => 25350.0, 'VUV' => 119.5, 'WST' => 2.75, 'XAF' => 603.5, 'XCD' => 2.7,
            'XDR' => 0.76, 'XOF' => 603.5, 'XPF' => 109.8, 'YER' => 250.0, 'ZAR' => 18.2,
            'ZMW' => 27.0, 'ZWL' => 322.0,
        ];
    }
}
