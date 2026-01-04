<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Carbon\Carbon;

class Staking extends Model
{
    use HasFactory;

    protected $table = 'staking';

    protected $fillable = [
        'user_id',
        'crypto_currency',
        'amount',
        'reward_rate',
        'earned_rewards',
        'status',
        'lock_period_days',
        'started_at',
        'ends_at',
        'claimed_at',
    ];

    protected $casts = [
        'amount' => 'decimal:8',
        'reward_rate' => 'decimal:2',
        'earned_rewards' => 'decimal:8',
        'started_at' => 'datetime',
        'ends_at' => 'datetime',
        'claimed_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function calculateCurrentReward(): float
    {
        if ($this->status !== 'active') {
            return (float) $this->earned_rewards;
        }

        try {
            $startDate = $this->started_at ?? $this->created_at;

            if (!$startDate) {
                return 0;
            }

            $daysElapsed = $startDate->diffInDays(now());

            // Формула: (amount * reward_rate / 100) / 365 * daysElapsed
            $dailyRate = ($this->amount * $this->reward_rate / 100) / 365;
            $currentReward = $dailyRate * $daysElapsed;

            return round((float) $currentReward, 8);
        } catch (\Exception $e) {
            \Log::error('Error calculating reward', [
                'staking_id' => $this->id,
                'error' => $e->getMessage()
            ]);
            return 0;
        }
    }

    public function canUnstake(): bool
    {
        if ($this->status !== 'active') {
            return false;
        }

        if (!$this->ends_at) {
            return true; // Гибкий стейкинг
        }

        return now()->gte($this->ends_at);
    }

    public function getProgressPercentage(): int
    {
        if ($this->status !== 'active') {
            return 100;
        }

        if ($this->lock_period_days === 0) {
            return 100; // Гибкий стейкинг
        }

        try {
            $startDate = $this->started_at ?? $this->created_at;

            if (!$startDate) {
                return 0;
            }

            $totalDays = $this->lock_period_days;
            $elapsedDays = $startDate->diffInDays(now());

            if ($elapsedDays >= $totalDays) {
                return 100;
            }

            return (int) (($elapsedDays / $totalDays) * 100);
        } catch (\Exception $e) {
            return 0;
        }
    }
}
