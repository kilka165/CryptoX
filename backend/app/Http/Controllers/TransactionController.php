<?php

namespace App\Http\Controllers;

use App\Models\Transaction;
use App\Models\P2PTrade;
use App\Models\Staking;
use App\Services\CurrencyService;
use Illuminate\Http\Request;
use Illuminate\Pagination\LengthAwarePaginator;
use Illuminate\Support\Collection;


class TransactionController extends Controller
{
    private const PER_PAGE = 10;

    /**
     * Единая лента истории операций: обычные транзакции (покупка/продажа/
     * пополнение/вывод) + P2P-сделки + стейкинг. Источники нормализуются
     * к общей форме, сортируются по дате и отдаются постранично в том же
     * формате, что и пагинатор Eloquent ({ data, current_page, last_page, total }).
     */
    public function getHistory(Request $request, CurrencyService $currency)
    {
        $user = $request->user();
        if (!$user) {
            return response()->json(['message' => 'Unauthorized'], 401);
        }

        $type = (string) $request->query('type', 'all');
        $search = trim((string) $request->query('search', ''));

        $items = collect()
            ->concat($this->mapTransactions($user->id))
            ->concat($this->mapP2P($user->id, $currency))
            ->concat($this->mapStaking($user->id));

        // Фильтр по типу. p2p объединяет обе стороны сделки.
        if ($type !== 'all') {
            $items = $items->filter(function (array $item) use ($type) {
                return $type === 'p2p'
                    ? in_array($item['kind'], ['p2p_buy', 'p2p_sell'], true)
                    : $item['kind'] === $type;
            });
        }

        // Поиск по монете и контрагенту.
        if ($search !== '') {
            $needle = mb_strtolower($search);
            $items = $items->filter(function (array $item) use ($needle) {
                $hay = mb_strtolower(trim(
                    ($item['coin'] ?? '') . ' ' . ($item['symbol'] ?? '') . ' ' . ($item['counterparty'] ?? '')
                ));
                return $hay !== '' && str_contains($hay, $needle);
            });
        }

        // Сортировка по выбранной колонке. date — по умолчанию (убыв.);
        // дата также служит вторичным ключом при равенстве значений.
        $sortKey = in_array($request->query('sort'), ['type', 'asset', 'amount', 'price', 'total', 'date'], true)
            ? (string) $request->query('sort')
            : 'date';
        $asc = strtolower((string) $request->query('dir', 'desc')) === 'asc';

        $items = $items->sortByDesc(fn (array $item) => $item['sort_ts'])->values();

        if ($sortKey === 'date') {
            $sorted = ($asc ? $items->reverse() : $items)->values();
        } else {
            $valueFor = fn (array $i) => match ($sortKey) {
                'type' => $i['kind'],
                'asset' => mb_strtolower((string) ($i['symbol'] ?? $i['coin'] ?? '')),
                'amount' => (float) $i['amount'],
                'price' => (float) $i['price_usd'],
                'total' => (float) $i['total_usd'],
            };
            $sorted = ($asc ? $items->sortBy($valueFor) : $items->sortByDesc($valueFor))->values();
        }

        $page = max(1, (int) $request->query('page', 1));
        $total = $sorted->count();

        $pageItems = $sorted
            ->forPage($page, self::PER_PAGE)
            ->map(function (array $item) {
                unset($item['sort_ts']); // служебное поле сортировки наружу не отдаём
                return $item;
            })
            ->values();

        $paginator = new LengthAwarePaginator(
            $pageItems,
            $total,
            self::PER_PAGE,
            $page,
            ['path' => $request->url(), 'query' => $request->query()]
        );

        return response()->json($paginator);
    }

    /**
     * Обычные транзакции из таблицы transactions (buy/sell/deposit/withdraw).
     */
    private function mapTransactions(int $userId): Collection
    {
        return Transaction::with('asset')
            ->where('user_id', $userId)
            ->get()
            ->map(function ($t) {
                return [
                    'id' => 'tx-' . $t->id,
                    'kind' => $t->type,
                    'coin' => $t->coin,
                    'symbol' => $t->asset->symbol ?? null,
                    'amount' => (float) $t->amount,
                    'price_usd' => (float) $t->price_usd,
                    'total_usd' => (float) $t->total_usd,
                    'fee' => (float) $t->fee,
                    'status' => $t->status,
                    'card_mask' => $t->card_mask,
                    'created_at' => optional($t->created_at)->toISOString(),
                    'sort_ts' => optional($t->created_at)->timestamp ?? 0,
                ];
            });
    }

    /**
     * P2P-сделки пользователя (как покупателя, так и продавца оффера).
     * Контрагент и валюта берутся из связанного оффера (та же логика, что
     * в P2PController::getMyTrades).
     */
    private function mapP2P(int $userId, CurrencyService $currency): Collection
    {
        return P2PTrade::with(['buyer', 'offer.seller'])
            ->where(function ($q) use ($userId) {
                $q->where('buyer_id', $userId)
                    ->orWhereHas('offer', fn ($q2) => $q2->where('seller_id', $userId));
            })
            ->get()
            ->map(function ($trade) use ($userId, $currency) {
                $offer = $trade->offer;
                if (!$offer) {
                    return null;
                }

                $isBuyer = $trade->buyer_id === $userId;
                $cryptoAmount = (float) $trade->crypto_amount;
                $totalUsd = $currency->convert((float) $trade->amount, (string) $offer->currency, 'USD');
                $priceUsd = $cryptoAmount > 0 ? $totalUsd / $cryptoAmount : 0.0;

                return [
                    'id' => 'p2p-' . $trade->id,
                    'kind' => $isBuyer ? 'p2p_buy' : 'p2p_sell',
                    'coin' => $offer->crypto_currency,
                    'symbol' => $offer->crypto_currency,
                    'amount' => $cryptoAmount,
                    'price_usd' => $priceUsd,
                    'total_usd' => $totalUsd,
                    'fee' => 0.0,
                    'status' => $trade->status,
                    'role' => $isBuyer ? 'buyer' : 'seller',
                    'counterparty' => $isBuyer
                        ? ($offer->seller->name ?? '—')
                        : ($trade->buyer->name ?? '—'),
                    'fiat_amount' => (float) $trade->amount,
                    'fiat_currency' => $offer->currency,
                    'card_mask' => null,
                    'created_at' => optional($trade->created_at)->toISOString(),
                    'sort_ts' => optional($trade->created_at)->timestamp ?? 0,
                ];
            })
            ->filter()
            ->values();
    }

    /**
     * Стейкинг-позиции пользователя. Прибыль и прогресс считаются на лету
     * аксессорами модели (как в StakingController::getMyStaking).
     */
    private function mapStaking(int $userId): Collection
    {
        return Staking::where('user_id', $userId)
            ->get()
            ->map(function ($s) {
                $ts = $s->started_at ?? $s->created_at;

                return [
                    'id' => 'stk-' . $s->id,
                    'kind' => 'staking',
                    'coin' => $s->crypto_currency,
                    'symbol' => $s->crypto_currency,
                    'amount' => (float) $s->amount,
                    'price_usd' => 0.0,
                    'total_usd' => 0.0,
                    'fee' => 0.0,
                    'status' => $s->status,
                    'card_mask' => null,
                    'staking' => [
                        'days' => (int) $s->lock_period_days,
                        'apr' => (float) $s->reward_rate,
                        'profit' => (float) $s->calculateCurrentReward(),
                        'progress' => $s->getProgressPercentage(),
                        'started_at' => optional($s->started_at)->toISOString(),
                        'ends_at' => optional($s->ends_at)->toISOString(),
                        'claimed_at' => optional($s->claimed_at)->toISOString(),
                    ],
                    'created_at' => optional($ts)->toISOString(),
                    'sort_ts' => optional($ts)->timestamp ?? 0,
                ];
            });
    }


    // Метод getStats добавь аналогично с проверкой if (!$user)
    public function getStats(Request $request)
    {
        $user = $request->user();

        // ✅ ПРОВЕРКА ПОЛЬЗОВАТЕЛЯ
        if (!$user) {
             return response()->json(['message' => 'Unauthorized'], 401);
        }

        $totalBuys = Transaction::where('user_id', $user->id)
            ->where('type', 'buy')
            ->sum('total_usd');

        $totalSells = Transaction::where('user_id', $user->id)
            ->where('type', 'sell')
            ->sum('total_usd');

        return response()->json([
            'total_buys_usd' => $totalBuys,
            'total_sells_usd' => $totalSells,
        ]);
    }
}
