<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Transaction extends Model
{
    protected $fillable = [
        'user_id',
        'asset_id',
        'type',
        'status',
        'amount',
        'price_usd',
        'total_usd',
        'description',
    ];

    protected $casts = [
        'amount' => 'decimal:8',
        'price_usd' => 'decimal:2',
        'total_usd' => 'decimal:2',
        'created_at' => 'datetime',
    ];

    public function user(): BelongsTo
    {
        return $this->belongsTo(User::class);
    }

    public function asset(): BelongsTo
    {
        return $this->belongsTo(Asset::class)->withDefault(); 
    }
}
