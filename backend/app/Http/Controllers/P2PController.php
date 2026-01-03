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

class P2PController extends Controller
{
    /**
     * Получить все предложения P2P
     */
    public function getOffers(Request $request)
    {
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
            return [
                'id' => $offer->id,
                'seller_id' => $offer->seller_id,
                'seller_name' => $offer->seller->name,
                'orders_count' => $offer->seller->p2p_orders_count ?? rand(10, 500),
                'completion_rate' => $offer->seller->completion_rate ?? rand(95, 100),
                'price' => (float) $offer->price,
                'currency' => $offer->currency,
                'crypto_currency' => $offer->crypto_currency,
                'min_limit' => (float) $offer->min_limit,
                'max_limit' => (float) $offer->max_limit,
                'available_amount' => (float) $offer->available_amount,
                'type' => $offer->type,
                'avg_completion_time' => rand(5, 30),
                'created_at' => $offer->created_at,
            ];
        }));
    }

    /**
     * Создать своё предложение с блокировкой средств
     */
    public function createOffer(Request $request)
    {
        $validated = $request->validate([
            'crypto_currency' => 'required|string',
            'currency' => 'required|string',
            'price' => 'required|numeric|min:0',
            'min_limit' => 'required|numeric|min:0',
            'max_limit' => 'required|numeric|min:0',
            'available_amount' => 'required|numeric|min:0',
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

            } else {
                // Покупка криптовалюты - блокируем USD из wallet
                $totalCost = $validated['price'] * $validated['available_amount'];

                // ВАЖНО: цена уже в той валюте, которую выбрал пользователь
                // Нужно конвертировать в USD для списания из wallet
                // Предполагаем, что фронтенд отправляет цену УЖЕ в USD
                // Или нужно конвертировать здесь

                $wallet = Wallet::where('user_id', $user->id)->first();

                if (!$wallet || $wallet->balance < $totalCost) {
                    DB::rollBack();
                    return response()->json([
                        'message' => "Недостаточно USD на балансе. Требуется: {$totalCost} USD, доступно: " . ($wallet ? $wallet->balance : 0) . " USD"
                    ], 400);
                }

                // Списываем USD с баланса
                $wallet->balance -= $totalCost;
                $wallet->save();

                Log::info('P2P Buy Offer - USD deducted from wallet', [
                    'user_id' => $user->id,
                    'total_cost' => $totalCost,
                    'remaining_balance' => $wallet->balance,
                ]);
            }

            // Создаём заявку
            $offer = P2POffer::create([
                'seller_id' => $user->id,
                'crypto_currency' => $validated['crypto_currency'],
                'currency' => $validated['currency'],
                'price' => $validated['price'],
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
            } else {
                // Возвращаем USD в wallet
                $totalCost = $offer->price * $offer->available_amount;

                $wallet = Wallet::firstOrCreate(
                    ['user_id' => $user->id],
                    ['balance' => 0]
                );

                $wallet->balance += $totalCost;
                $wallet->save();
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
            'amount' => 'required|numeric|min:0',
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

        $fiatAmount = $validated['amount'] * $offer->price;

        if ($fiatAmount < $offer->min_limit || $fiatAmount > $offer->max_limit) {
            return response()->json([
                'message' => "Сумма должна быть в пределах {$offer->min_limit} - {$offer->max_limit} {$offer->currency}"
            ], 400);
        }

        DB::beginTransaction();
        try {
            // Создаём сделку
            $trade = P2PTrade::create([
                'offer_id' => $offer->id,
                'buyer_id' => $user->id,
                'seller_id' => $offer->seller_id,
                'crypto_currency' => $offer->crypto_currency,
                'currency' => $offer->currency,
                'amount' => $validated['amount'],
                'price' => $offer->price,
                'total_fiat' => $fiatAmount,
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
                'amount' => $validated['amount'],
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

        $trades = P2PTrade::with(['buyer', 'seller', 'offer'])
            ->where(function ($query) use ($user) {
                $query->where('buyer_id', $user->id)
                      ->orWhere('seller_id', $user->id);
            })
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($trades->map(function ($trade) use ($user) {
            $isBuyer = $trade->buyer_id === $user->id;

            return [
                'id' => $trade->id,
                'crypto_currency' => $trade->crypto_currency,
                'currency' => $trade->currency,
                'amount' => (float) $trade->amount,
                'price' => (float) $trade->price,
                'total_fiat' => (float) $trade->total_fiat,
                'status' => $trade->status,
                'role' => $isBuyer ? 'buyer' : 'seller',
                'counterparty' => $isBuyer ? $trade->seller->name : $trade->buyer->name,
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

        if ($trade->seller_id !== $user->id && $trade->buyer_id !== $user->id) {
            return response()->json(['message' => 'Нет доступа к этой сделке'], 403);
        }

        if ($trade->status !== 'pending') {
            return response()->json(['message' => 'Сделка уже завершена или отменена'], 400);
        }

        DB::beginTransaction();
        try {
            // Обмен активами
            if ($trade->offer->type === 'sell') {
                // Продавец продаёт крипту за фиат
                // Крипта уже списана при создании заявки, просто переводим покупателю
                $buyerCrypto = UserAsset::firstOrCreate(
                    ['user_id' => $trade->buyer_id, 'coin_symbol' => $trade->crypto_currency],
                    ['coin_name' => $trade->crypto_currency, 'amount' => 0]
                );
                $buyerCrypto->amount += $trade->amount;
                $buyerCrypto->save();

                // Фиат от покупателя к продавцу
                $buyerFiat = UserAsset::where('user_id', $trade->buyer_id)
                    ->where('coin_symbol', $trade->currency)
                    ->first();

                if (!$buyerFiat || $buyerFiat->amount < $trade->total_fiat) {
                    DB::rollBack();
                    return response()->json(['message' => 'Недостаточно средств у покупателя'], 400);
                }

                $buyerFiat->amount -= $trade->total_fiat;
                $buyerFiat->save();

                $sellerFiat = UserAsset::firstOrCreate(
                    ['user_id' => $trade->seller_id, 'coin_symbol' => $trade->currency],
                    ['coin_name' => $trade->currency, 'amount' => 0]
                );
                $sellerFiat->amount += $trade->total_fiat;
                $sellerFiat->save();

            } else {
                // Продавец покупает крипту за фиат
                // Фиат уже списан при создании заявки
                $sellerCrypto = UserAsset::firstOrCreate(
                    ['user_id' => $trade->seller_id, 'coin_symbol' => $trade->crypto_currency],
                    ['coin_name' => $trade->crypto_currency, 'amount' => 0]
                );
                $sellerCrypto->amount += $trade->amount;
                $sellerCrypto->save();

                // Крипта от покупателя (который на самом деле продаёт)
                $buyerCrypto = UserAsset::where('user_id', $trade->buyer_id)
                    ->where('coin_symbol', $trade->crypto_currency)
                    ->first();

                if (!$buyerCrypto || $buyerCrypto->amount < $trade->amount) {
                    DB::rollBack();
                    return response()->json(['message' => 'Недостаточно криптовалюты'], 400);
                }

                $buyerCrypto->amount -= $trade->amount;
                $buyerCrypto->save();

                // Фиат передаём от заблокированных средств продавца покупателю
                $buyerFiat = UserAsset::firstOrCreate(
                    ['user_id' => $trade->buyer_id, 'coin_symbol' => $trade->currency],
                    ['coin_name' => $trade->currency, 'amount' => 0]
                );
                $buyerFiat->amount += $trade->total_fiat;
                $buyerFiat->save();
            }

            $trade->status = 'completed';
            $trade->save();

            DB::commit();

            Log::info('P2P Trade Confirmed', [
                'trade_id' => $trade->id,
                'buyer_id' => $trade->buyer_id,
                'seller_id' => $trade->seller_id,
            ]);

            return response()->json([
                'message' => 'Сделка успешно завершена',
                'trade' => $trade,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('P2P Trade Confirmation Failed', ['error' => $e->getMessage()]);
            return response()->json(['message' => 'Ошибка при подтверждении сделки'], 500);
        }
    }

    /**
     * Отменить сделку
     */
    public function cancelTrade($id)
    {
        $user = auth()->user();
        $trade = P2PTrade::with('offer')->findOrFail($id);

        if ($trade->seller_id !== $user->id && $trade->buyer_id !== $user->id) {
            return response()->json(['message' => 'Нет доступа к этой сделке'], 403);
        }

        if ($trade->status !== 'pending') {
            return response()->json(['message' => 'Сделка уже завершена или отменена'], 400);
        }

        DB::beginTransaction();
        try {
            // Возвращаем количество обратно в заявку
            $offer = $trade->offer;
            $offer->available_amount += $trade->amount;
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
