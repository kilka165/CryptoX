<?php

namespace App\Http\Controllers;

use App\Models\P2POffer;
use App\Models\P2PTrade;
use App\Models\Asset;
use App\Models\Wallet;
use App\Models\Transaction;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Http;

class P2PController extends Controller
{
    /**
     * Получить курс валюты к USD
     */
    private function getExchangeRate($currency)
    {
        if ($currency === 'USD') {
            return 1;
        }

        try {
            $response = Http::get("https://api.exchangerate-api.com/v4/latest/USD");
            $rates = $response->json()['rates'] ?? [];
            return $rates[$currency] ?? 1;
        } catch (\Exception $e) {
            Log::error('Exchange rate fetch failed', ['error' => $e->getMessage()]);

            // Fallback курсы
            $fallbackRates = [
                'KZT' => 450,
                'RUB' => 90,
                'EUR' => 0.85,
                'GBP' => 0.73,
            ];

            return $fallbackRates[$currency] ?? 1;
        }
    }

    /**
     * Конвертировать сумму из одной валюты в другую через USD
     */
    private function convertCurrency($amount, $fromCurrency, $toCurrency)
    {
        if ($fromCurrency === $toCurrency) {
            return $amount;
        }

        // Конвертируем в USD
        $fromRate = $this->getExchangeRate($fromCurrency);
        $amountInUSD = $amount / $fromRate;

        // Конвертируем из USD в целевую валюту
        $toRate = $this->getExchangeRate($toCurrency);
        return $amountInUSD * $toRate;
    }

        /**
     * Получить все предложения P2P
     */
    public function getOffers(Request $request)
    {
        try {
            $query = P2POffer::with('seller')
                ->where('is_active', true)
                ->where('available_amount', '>', 0);

            if ($request->filled('crypto_currency')) {
                $query->where('crypto_currency', $request->crypto_currency);
            }

            if ($request->filled('currency')) {
                $query->where('currency', $request->currency);
            }

            if ($request->filled('type')) {
                $userWants = $request->type;
                $showType = $userWants === 'buy' ? 'sell' : 'buy';
                $query->where('type', $showType);
            }

            $offers = $query->orderBy('price', 'asc')->get();

            return response()->json($offers->map(function ($offer) {
                // Получаем реальное количество завершённых сделок пользователя
                $completedTrades = 0;
                $totalTrades = 0;

                try {
                    $completedTrades = P2PTrade::where(function ($query) use ($offer) {
                            $query->where('buyer_id', $offer->seller_id)
                                  ->orWhere('seller_id', $offer->seller_id);
                        })
                        ->where('status', 'completed')
                        ->count();

                    $totalTrades = P2PTrade::where(function ($query) use ($offer) {
                            $query->where('buyer_id', $offer->seller_id)
                                  ->orWhere('seller_id', $offer->seller_id);
                        })
                        ->whereIn('status', ['completed', 'cancelled'])
                        ->count();
                } catch (\Exception $e) {
                    Log::warning('Error fetching P2P trade stats', ['error' => $e->getMessage()]);
                }

                // Вычисляем процент выполнения
                $completionRate = $totalTrades > 0
                    ? round(($completedTrades / $totalTrades) * 100)
                    : 100;

                return [
                    'id' => $offer->id,
                    'seller_id' => $offer->seller_id,
                    'seller_name' => $offer->seller->name,
                    'orders_count' => $completedTrades,
                    'completion_rate' => $completionRate,
                    'price' => (float) $offer->price,
                    'currency' => $offer->currency,
                    'crypto_currency' => $offer->crypto_currency,
                    'min_limit' => (float) $offer->min_limit,
                    'max_limit' => (float) $offer->max_limit,
                    'available_amount' => (float) $offer->available_amount,
                    'type' => $offer->type,
                    'created_at' => $offer->created_at,
                ];
            }));
        } catch (\Exception $e) {
            Log::error('Error fetching P2P offers', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Ошибка при получении заявок',
                'error' => $e->getMessage()
            ], 500);
        }
    }



    /**
     * Создать своё предложение с блокировкой средств
     */
    public function createOffer(Request $request)
    {
        $validated = $request->validate([
            'crypto_currency' => 'required|string',
            'currency' => 'required|string', // Валюта для отображения цены
            'price' => 'required|numeric|min:0', // Цена в выбранной валюте
            'min_limit' => 'required|numeric|min:0', // Лимиты в выбранной валюте
            'max_limit' => 'required|numeric|min:0',
            'available_amount' => 'required|numeric|min:0', // Количество крипты
            'type' => 'required|in:buy,sell',
        ]);

        $user = auth()->user();

        DB::beginTransaction();
        try {
            if ($validated['type'] === 'sell') {
                // Продажа криптовалюты - блокируем крипту
                $asset = Asset::where('user_id', $user->id)
                    ->where('name', $validated['crypto_currency'])
                    ->first();

                if (!$asset || $asset->amount < $validated['available_amount']) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Недостаточно {$validated['crypto_currency']} на балансе"
                    ], 400);
                }

                // Списываем крипту с баланса
                $asset->amount -= $validated['available_amount'];
                $asset->save();

                Log::info('P2P Sell Offer - Crypto locked', [
                    'user_id' => $user->id,
                    'crypto' => $validated['crypto_currency'],
                    'amount' => $validated['available_amount'],
                ]);

            } else {
                // Покупка криптовалюты - блокируем USD из wallet
                // Конвертируем цену из выбранной валюты в USD
                $priceInUSD = $this->convertCurrency($validated['price'], $validated['currency'], 'USD');
                $totalCostUSD = $priceInUSD * $validated['available_amount'];

                $wallet = Wallet::where('user_id', $user->id)->first();

                if (!$wallet || $wallet->balance < $totalCostUSD) {
                    DB::rollBack();

                    // Для удобства покажем сумму в обеих валютах
                    $totalCostInCurrency = $validated['price'] * $validated['available_amount'];

                    return response()->json([
                        'message' => "Недостаточно средств на балансе.",
                        'required_usd' => round($totalCostUSD, 2),
                        'required_' . strtolower($validated['currency']) => round($totalCostInCurrency, 2),
                        'available_usd' => $wallet ? round($wallet->balance, 2) : 0,
                    ], 400);
                }

                // Списываем USD с баланса
                $wallet->balance -= $totalCostUSD;
                $wallet->save();

                Log::info('P2P Buy Offer - USD deducted from wallet', [
                    'user_id' => $user->id,
                    'price_display_currency' => $validated['currency'],
                    'price_display' => $validated['price'],
                    'price_usd' => $priceInUSD,
                    'total_cost_usd' => $totalCostUSD,
                    'remaining_balance_usd' => $wallet->balance,
                ]);
            }

            // Создаём заявку (цена сохраняется в той валюте, которую выбрал пользователь)
            $offer = P2POffer::create([
                'seller_id' => $user->id,
                'crypto_currency' => $validated['crypto_currency'],
                'currency' => $validated['currency'], // Валюта отображения
                'price' => $validated['price'], // Цена в валюте отображения
                'min_limit' => $validated['min_limit'],
                'max_limit' => $validated['max_limit'],
                'available_amount' => $validated['available_amount'],
                'type' => $validated['type'],
                'is_active' => true,
            ]);

            DB::commit();

            Log::info('P2P Offer Created', [
                'offer_id' => $offer->id,
                'user_id' => $user->id,
                'type' => $validated['type'],
                'amount' => $validated['available_amount'],
            ]);

            return response()->json([
                'message' => 'Заявка успешно создана',
                'offer' => $offer
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('P2P Offer Creation Failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Ошибка при создании заявки: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Удалить свою заявку с возвратом средств
     */
    public function deleteOffer($id)
    {
        $user = auth()->user();
        $offer = P2POffer::find($id);

        if (!$offer) {
            return response()->json(['message' => 'Заявка не найдена'], 404);
        }

        if ($offer->seller_id !== $user->id) {
            return response()->json(['message' => 'Нет прав на удаление этой заявки'], 403);
        }

        DB::beginTransaction();
        try {
            if ($offer->type === 'sell') {
                // Возвращаем криптовалюту
                $asset = Asset::where('user_id', $user->id)
                    ->where('name', $offer->crypto_currency)
                    ->first();

                if ($asset) {
                    $asset->amount += $offer->available_amount;
                    $asset->save();
                } else {
                    Asset::create([
                        'user_id' => $user->id,
                        'name' => $offer->crypto_currency,
                        'symbol' => strtoupper(substr($offer->crypto_currency, 0, 3)),
                        'amount' => $offer->available_amount,
                    ]);
                }

                Log::info('P2P Offer Deleted - Crypto returned', [
                    'offer_id' => $id,
                    'crypto' => $offer->crypto_currency,
                    'amount' => $offer->available_amount,
                ]);

            } else {
                // Возвращаем USD в wallet (конвертируем из валюты заявки)
                $priceInUSD = $this->convertCurrency($offer->price, $offer->currency, 'USD');
                $totalCostUSD = $priceInUSD * $offer->available_amount;

                $wallet = Wallet::firstOrCreate(
                    ['user_id' => $user->id],
                    ['balance' => 0]
                );

                $wallet->balance += $totalCostUSD;
                $wallet->save();

                Log::info('P2P Offer Deleted - USD returned', [
                    'offer_id' => $id,
                    'returned_usd' => $totalCostUSD,
                    'new_balance' => $wallet->balance,
                ]);
            }

            $offer->delete();
            DB::commit();

            return response()->json(['message' => 'Заявка успешно удалена'], 200);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('P2P Offer Deletion Failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Ошибка при удалении заявки'], 500);
        }
    }

    /**
     * Создать сделку (купить/продать по заявке)
     */
    public function createTrade(Request $request)
    {
        $validated = $request->validate([
            'offer_id' => 'required|exists:p2p_offers,id',
            'amount' => 'required|numeric|min:0', // Количество крипты
        ]);

        $user = auth()->user();
        $offer = P2POffer::with('seller')->findOrFail($validated['offer_id']);

        if ($offer->seller_id === $user->id) {
            return response()->json(['message' => 'Нельзя купить у самого себя'], 400);
        }

        if (!$offer->is_active) {
            return response()->json(['message' => 'Заявка неактивна'], 400);
        }

        if ($validated['amount'] > $offer->available_amount) {
            return response()->json(['message' => 'Недостаточно криптовалюты в заявке'], 400);
        }

        // Считаем сумму в валюте заявки
        $fiatAmount = $validated['amount'] * $offer->price;

        if ($fiatAmount < $offer->min_limit || $fiatAmount > $offer->max_limit) {
            return response()->json([
                'message' => "Сумма должна быть в пределах {$offer->min_limit} - {$offer->max_limit} {$offer->currency}"
            ], 400);
        }

        // Конвертируем в USD для проверки баланса
        $fiatAmountUSD = $this->convertCurrency($fiatAmount, $offer->currency, 'USD');

        DB::beginTransaction();
        try {
            // Проверяем баланс покупателя (если он покупает крипту - нужны USD)
            if ($offer->type === 'sell') {
                // Продавец продает крипту, покупателю нужны USD
                $buyerWallet = Wallet::where('user_id', $user->id)->first();

                if (!$buyerWallet || $buyerWallet->balance < $fiatAmountUSD) {
                    DB::rollBack();
                    return response()->json([
                        'message' => 'Недостаточно средств на балансе',
                        'required_usd' => round($fiatAmountUSD, 2),
                        'available_usd' => $buyerWallet ? round($buyerWallet->balance, 2) : 0,
                    ], 400);
                }
            } else {
                // Продавец покупает крипту, покупателю нужна крипта
                $buyerCrypto = Asset::where('user_id', $user->id)
                    ->where('name', $offer->crypto_currency)
                    ->first();

                if (!$buyerCrypto || $buyerCrypto->amount < $validated['amount']) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Недостаточно {$offer->crypto_currency} на балансе",
                        'required' => $validated['amount'],
                        'available' => $buyerCrypto ? $buyerCrypto->amount : 0,
                    ], 400);
                }
            }

            // Создаём сделку
            $trade = P2PTrade::create([
                'offer_id' => $offer->id,
                'buyer_id' => $user->id,
                'amount' => $fiatAmount, // Сумма в валюте заявки
                'crypto_amount' => $validated['amount'], // Количество крипты
                'status' => 'pending',
            ]);

            // Уменьшаем доступное количество в заявке
            $offer->available_amount -= $validated['amount'];

            if ($offer->available_amount <= 0) {
                $offer->is_active = false;
            }

            $offer->save();

            DB::commit();

            Log::info('P2P Trade Created', [
                'trade_id' => $trade->id,
                'buyer_id' => $user->id,
                'seller_id' => $offer->seller_id,
                'crypto_amount' => $validated['amount'],
                'fiat_amount_display' => $fiatAmount,
                'fiat_amount_usd' => $fiatAmountUSD,
            ]);

            return response()->json([
                'message' => 'Сделка создана',
                'trade' => $trade,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('P2P Trade Creation Failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Ошибка при создании сделки'], 500);
        }
    }

    /**
     * Получить свои сделки
     */
    public function getMyTrades()
    {
        $user = auth()->user();

        $trades = P2PTrade::with(['buyer', 'offer.seller'])
            ->where(function ($query) use ($user) {
                $query->where('buyer_id', $user->id)
                      ->orWhereHas('offer', function ($q) use ($user) {
                          $q->where('seller_id', $user->id);
                      });
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($trades->map(function ($trade) use ($user) {
            $isBuyer = $trade->buyer_id === $user->id;

            // Конвертируем сумму в USD для справки
            $totalUSD = $this->convertCurrency($trade->amount, $trade->offer->currency, 'USD');

            return [
                'id' => $trade->id,
                'crypto_currency' => $trade->offer->crypto_currency,
                'currency' => $trade->offer->currency,
                'crypto_amount' => (float) $trade->crypto_amount,
                'price' => (float) $trade->offer->price,
                'total_fiat' => (float) $trade->amount,
                'total_usd' => (float) $totalUSD,
                'status' => $trade->status,
                'role' => $isBuyer ? 'buyer' : 'seller',
                'counterparty' => $isBuyer ? $trade->offer->seller->name : $trade->buyer->name,
                'created_at' => $trade->created_at,
                'updated_at' => $trade->updated_at,
            ];
        }));
    }

    /**
     * Подтвердить сделку
     */
    public function confirmTrade($id)
    {
        $user = auth()->user();
        $trade = P2PTrade::with('offer')->findOrFail($id);

        // Проверяем права доступа
        if ($trade->offer->seller_id !== $user->id && $trade->buyer_id !== $user->id) {
            return response()->json(['message' => 'Нет доступа к этой сделке'], 403);
        }

        if ($trade->status !== 'pending') {
            return response()->json(['message' => 'Сделка уже завершена или отменена'], 400);
        }

        DB::beginTransaction();
        try {
            $offer = $trade->offer;

            // Конвертируем фиатную сумму в USD для операций с кошельком
            $fiatAmountUSD = $this->convertCurrency($trade->amount, $offer->currency, 'USD');

            if ($offer->type === 'sell') {
                // Продавец продаёт крипту за фиат
                // Крипта уже списана при создании заявки, просто переводим покупателю
                $buyerCrypto = Asset::firstOrCreate(
                    [
                        'user_id' => $trade->buyer_id,
                        'name' => $offer->crypto_currency
                    ],
                    [
                        'symbol' => strtoupper(substr($offer->crypto_currency, 0, 3)),
                        'amount' => 0
                    ]
                );
                $buyerCrypto->amount += $trade->crypto_amount;
                $buyerCrypto->save();

                // USD от покупателя к продавцу
                $buyerWallet = Wallet::where('user_id', $trade->buyer_id)->first();

                if (!$buyerWallet || $buyerWallet->balance < $fiatAmountUSD) {
                    DB::rollBack();
                    return response()->json(['message' => 'Недостаточно средств у покупателя'], 400);
                }

                $buyerWallet->balance -= $fiatAmountUSD;
                $buyerWallet->save();

                $sellerWallet = Wallet::firstOrCreate(
                    ['user_id' => $offer->seller_id],
                    ['balance' => 0]
                );
                $sellerWallet->balance += $fiatAmountUSD;
                $sellerWallet->save();

                Log::info('P2P Trade Confirmed - Sell', [
                    'trade_id' => $trade->id,
                    'crypto_to_buyer' => $trade->crypto_amount,
                    'usd_to_seller' => $fiatAmountUSD,
                ]);

            } else {
                // Продавец покупает крипту за фиат
                // USD уже списан при создании заявки, выдаём крипту продавцу
                $sellerCrypto = Asset::firstOrCreate(
                    [
                        'user_id' => $offer->seller_id,
                        'name' => $offer->crypto_currency
                    ],
                    [
                        'symbol' => strtoupper(substr($offer->crypto_currency, 0, 3)),
                        'amount' => 0
                    ]
                );
                $sellerCrypto->amount += $trade->crypto_amount;
                $sellerCrypto->save();

                // Крипта от покупателя (который на самом деле продаёт)
                $buyerCrypto = Asset::where('user_id', $trade->buyer_id)
                    ->where('name', $offer->crypto_currency)
                    ->first();

                if (!$buyerCrypto || $buyerCrypto->amount < $trade->crypto_amount) {
                    DB::rollBack();
                    return response()->json(['message' => 'Недостаточно криптовалюты'], 400);
                }

                $buyerCrypto->amount -= $trade->crypto_amount;
                $buyerCrypto->save();

                // USD передаём от заблокированных средств продавца покупателю
                $buyerWallet = Wallet::firstOrCreate(
                    ['user_id' => $trade->buyer_id],
                    ['balance' => 0]
                );
                $buyerWallet->balance += $fiatAmountUSD;
                $buyerWallet->save();

                Log::info('P2P Trade Confirmed - Buy', [
                    'trade_id' => $trade->id,
                    'crypto_to_seller' => $trade->crypto_amount,
                    'usd_to_buyer' => $fiatAmountUSD,
                ]);
            }

            $trade->status = 'completed';
            $trade->save();

            DB::commit();

            return response()->json([
                'message' => 'Сделка успешно завершена',
                'trade' => $trade,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('P2P Trade Confirmation Failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Ошибка при подтверждении сделки: ' . $e->getMessage()], 500);
        }
    }

    /**
     * Отменить сделку
     */
    public function cancelTrade($id)
    {
        $user = auth()->user();
        $trade = P2PTrade::with('offer')->findOrFail($id);

        if ($trade->offer->seller_id !== $user->id && $trade->buyer_id !== $user->id) {
            return response()->json(['message' => 'Нет доступа к этой сделке'], 403);
        }

        if ($trade->status !== 'pending') {
            return response()->json(['message' => 'Сделка уже завершена или отменена'], 400);
        }

        DB::beginTransaction();
        try {
            // Возвращаем количество обратно в заявку
            $offer = $trade->offer;
            $offer->available_amount += $trade->crypto_amount;
            $offer->is_active = true;
            $offer->save();

            $trade->status = 'cancelled';
            $trade->save();

            DB::commit();

            Log::info('P2P Trade Cancelled', [
                'trade_id' => $trade->id,
                'cancelled_by' => $user->id,
            ]);

            return response()->json(['message' => 'Сделка отменена']);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('P2P Trade Cancellation Failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Ошибка при отмене сделки'], 500);
        }
    }
}
