<?php

namespace App\Http\Controllers;

use App\Models\Staking;
use App\Models\Asset;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Log;
use Carbon\Carbon;

class StakingController extends Controller
{
    public function getPlans()
    {
        $plans = [
            [
                'id' => 1,
                'name' => 'Гибкий',
                'days' => 0,
                'rate' => 2.0,
                'min_amount' => 0.001,
                'description' => 'Вывод в любое время',
            ],
            [
                'id' => 2,
                'name' => '30 дней',
                'days' => 30,
                'rate' => 5.0,
                'min_amount' => 0.01,
                'description' => 'Средний доход',
            ],
            [
                'id' => 3,
                'name' => '90 дней',
                'days' => 90,
                'rate' => 10.0,
                'min_amount' => 0.05,
                'description' => 'Высокий доход',
            ],
            [
                'id' => 4,
                'name' => '180 дней',
                'days' => 180,
                'rate' => 15.0,
                'min_amount' => 0.1,
                'description' => 'Максимальный доход',
            ],
        ];

        return response()->json($plans);
    }

    public function getUserAssets()
    {
        try {
            $user = auth()->user();
            $assets = Asset::where('user_id', $user->id)
                ->where('amount', '>', 0)
                ->get();

            return response()->json($assets);
        } catch (\Exception $e) {
            Log::error('Error fetching user assets', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Ошибка при получении активов'
            ], 500);
        }
    }

    public function stake(Request $request)
    {
        $validated = $request->validate([
            'crypto_currency' => 'required|string',
            'amount' => 'required|numeric|min:0.001',
            'plan_id' => 'required|integer|min:1|max:4',
        ]);

        $user = auth()->user();

        $plans = [
            1 => ['days' => 0, 'rate' => 2.0],
            2 => ['days' => 30, 'rate' => 5.0],
            3 => ['days' => 90, 'rate' => 10.0],
            4 => ['days' => 180, 'rate' => 15.0],
        ];

        $plan = $plans[$validated['plan_id']];

        DB::beginTransaction();
        try {
            $asset = Asset::where('user_id', $user->id)
                ->where('name', $validated['crypto_currency'])
                ->first();

            if (!$asset || $asset->amount < $validated['amount']) {
                DB::rollBack();
                return response()->json([
                    'message' => "Недостаточно {$validated['crypto_currency']} на балансе"
                ], 400);
            }

            $asset->amount -= $validated['amount'];
            $asset->save();

            $startDate = now();
            $endDate = $plan['days'] > 0
                ? $startDate->copy()->addDays($plan['days'])
                : null;

            $staking = Staking::create([
                'user_id' => $user->id,
                'crypto_currency' => $validated['crypto_currency'],
                'amount' => $validated['amount'],
                'reward_rate' => $plan['rate'],
                'lock_period_days' => $plan['days'],
                'status' => 'active',
                'started_at' => $startDate,
                'ends_at' => $endDate,
            ]);

            DB::commit();

            Log::info('Staking created', [
                'staking_id' => $staking->id,
                'user_id' => $user->id,
            ]);

            return response()->json([
                'message' => 'Стейкинг успешно создан',
                'staking' => $staking,
            ], 201);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Staking creation failed', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Ошибка при создании стейкинга: ' . $e->getMessage()
            ], 500);
        }
    }

    public function getMyStaking()
    {
        try {
            $user = auth()->user();

            $stakings = Staking::where('user_id', $user->id)
                ->orderBy('created_at', 'desc')
                ->get();

            return response()->json($stakings->map(function ($staking) {
                try {
                    return [
                        'id' => $staking->id,
                        'crypto_currency' => $staking->crypto_currency,
                        'amount' => (float) $staking->amount,
                        'reward_rate' => (float) $staking->reward_rate,
                        'earned_rewards' => $staking->calculateCurrentReward(),
                        'status' => $staking->status,
                        'lock_period_days' => $staking->lock_period_days,
                        'progress' => $staking->getProgressPercentage(),
                        'can_unstake' => $staking->canUnstake(),
                        'started_at' => $staking->started_at ? $staking->started_at->toISOString() : null,
                        'ends_at' => $staking->ends_at ? $staking->ends_at->toISOString() : null,
                        'claimed_at' => $staking->claimed_at ? $staking->claimed_at->toISOString() : null,
                    ];
                } catch (\Exception $e) {
                    Log::error('Error mapping staking', [
                        'staking_id' => $staking->id,
                        'error' => $e->getMessage()
                    ]);
                    return null;
                }
            })->filter());

        } catch (\Exception $e) {
            Log::error('Error fetching staking positions', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Ошибка при получении стейкингов',
                'error' => $e->getMessage()
            ], 500);
        }
    }

    public function unstake($id)
    {
        $user = auth()->user();
        $staking = Staking::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$staking) {
            return response()->json(['message' => 'Стейкинг не найден'], 404);
        }

        if ($staking->status !== 'active') {
            return response()->json(['message' => 'Стейкинг уже завершён'], 400);
        }

        if (!$staking->canUnstake()) {
            return response()->json([
                'message' => 'Период блокировки ещё не завершён'
            ], 400);
        }

        DB::beginTransaction();
        try {
            $finalReward = $staking->calculateCurrentReward();

            $asset = Asset::where('user_id', $user->id)
                ->where('name', $staking->crypto_currency)
                ->first();

            if ($asset) {
                $asset->amount += $staking->amount + $finalReward;
                $asset->save();
            } else {
                Asset::create([
                    'user_id' => $user->id,
                    'name' => $staking->crypto_currency,
                    'symbol' => strtoupper(substr($staking->crypto_currency, 0, 3)),
                    'amount' => $staking->amount + $finalReward,
                ]);
            }

            $staking->earned_rewards = $finalReward;
            $staking->status = 'completed';
            $staking->claimed_at = now();
            $staking->save();

            DB::commit();

            return response()->json([
                'message' => 'Средства успешно выведены',
                'total_received' => $staking->amount + $finalReward,
                'reward' => $finalReward,
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Unstaking failed', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Ошибка при выводе средств'
            ], 500);
        }
    }

    public function cancelFlexible($id)
    {
        $user = auth()->user();
        $staking = Staking::where('id', $id)
            ->where('user_id', $user->id)
            ->first();

        if (!$staking) {
            return response()->json(['message' => 'Стейкинг не найден'], 404);
        }

        if ($staking->status !== 'active') {
            return response()->json(['message' => 'Стейкинг уже завершён'], 400);
        }

        if ($staking->lock_period_days > 0) {
            return response()->json([
                'message' => 'Можно отменить только гибкий стейкинг'
            ], 400);
        }

        DB::beginTransaction();
        try {
            $asset = Asset::where('user_id', $user->id)
                ->where('name', $staking->crypto_currency)
                ->first();

            if ($asset) {
                $asset->amount += $staking->amount;
                $asset->save();
            } else {
                Asset::create([
                    'user_id' => $user->id,
                    'name' => $staking->crypto_currency,
                    'symbol' => strtoupper(substr($staking->crypto_currency, 0, 3)),
                    'amount' => $staking->amount,
                ]);
            }

            $staking->status = 'cancelled';
            $staking->save();

            DB::commit();

            return response()->json([
                'message' => 'Стейкинг отменён, средства возвращены'
            ]);

        } catch (\Exception $e) {
            DB::rollBack();
            Log::error('Staking cancellation failed', ['error' => $e->getMessage()]);
            return response()->json([
                'message' => 'Ошибка при отмене стейкинга'
            ], 500);
        }
    }
}
