<?php

namespace App\Http\Controllers;

use App\Services\CurrencyService;

class CurrencyController extends Controller
{
    public function __construct(private CurrencyService $currency) {}

    /**
     * Курсы валют относительно USD (кэшируются в CurrencyService на 1 час).
     */
    public function getRates()
    {
        $data = $this->currency->getRates();

        return response()->json([
            'rates' => $data['rates'],
            'source' => $data['source'],
            'fetched_at' => $data['fetched_at'] ?? null,
        ]);
    }

    /**
     * Получить список поддерживаемых фиатных валют для P2P и других операций
     */
    public function getSupportedCurrencies()
    {
        return response()->json([
            ['code' => 'USD', 'name' => 'Доллар США', 'symbol' => '$'],
            ['code' => 'EUR', 'name' => 'Евро', 'symbol' => '€'],
            ['code' => 'RUB', 'name' => 'Российский рубль', 'symbol' => '₽'],
            ['code' => 'KZT', 'name' => 'Тенге', 'symbol' => '₸'],
            ['code' => 'GBP', 'name' => 'Фунт стерлингов', 'symbol' => '£'],
            ['code' => 'CNY', 'name' => 'Китайский юань', 'symbol' => '¥'],
            ['code' => 'JPY', 'name' => 'Японская иена', 'symbol' => '¥'],
            ['code' => 'AUD', 'name' => 'Австралийский доллар', 'symbol' => 'A$'],
            ['code' => 'CAD', 'name' => 'Канадский доллар', 'symbol' => 'C$'],
            ['code' => 'CHF', 'name' => 'Швейцарский франк', 'symbol' => 'Fr'],
            ['code' => 'INR', 'name' => 'Индийская рупия', 'symbol' => '₹'],
            ['code' => 'BRL', 'name' => 'Бразильский реал', 'symbol' => 'R$'],
            ['code' => 'TRY', 'name' => 'Турецкая лира', 'symbol' => '₺'],
            ['code' => 'MXN', 'name' => 'Мексиканское песо', 'symbol' => '$'],
            ['code' => 'ZAR', 'name' => 'Южноафриканский рэнд', 'symbol' => 'R'],
        ]);
    }

    /**
     * Полный список валют с актуальными курсами (из того же кэшированного источника).
     */
    public function getAllCurrencies()
    {
        $rates = $this->currency->getRates()['rates'] ?? [];

        $currencyNames = [
            'USD' => ['name' => 'Доллар США', 'symbol' => '$'],
            'EUR' => ['name' => 'Евро', 'symbol' => '€'],
            'RUB' => ['name' => 'Российский рубль', 'symbol' => '₽'],
            'KZT' => ['name' => 'Тенге', 'symbol' => '₸'],
            'GBP' => ['name' => 'Фунт стерлингов', 'symbol' => '£'],
            'CNY' => ['name' => 'Китайский юань', 'symbol' => '¥'],
            'JPY' => ['name' => 'Японская иена', 'symbol' => '¥'],
            'AUD' => ['name' => 'Австралийский доллар', 'symbol' => 'A$'],
            'CAD' => ['name' => 'Канадский доллар', 'symbol' => 'C$'],
            'CHF' => ['name' => 'Швейцарский франк', 'symbol' => 'Fr'],
            'INR' => ['name' => 'Индийская рупия', 'symbol' => '₹'],
            'BRL' => ['name' => 'Бразильский реал', 'symbol' => 'R$'],
            'TRY' => ['name' => 'Турецкая лира', 'symbol' => '₺'],
        ];

        $currencies = [];
        foreach ($rates as $code => $rate) {
            $currencies[] = [
                'code' => $code,
                'name' => $currencyNames[$code]['name'] ?? $code,
                'symbol' => $currencyNames[$code]['symbol'] ?? $code,
                'rate' => $rate,
            ];
        }

        return response()->json($currencies);
    }
}
