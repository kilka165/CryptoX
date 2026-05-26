<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class P2POffer extends Model
{
    protected $table = 'p2p_offers';

    protected $fillable = [
        'seller_id',
        'crypto_currency',
        'currency',
        'price',
        'min_limit',
        'max_limit',
        'available_amount',
        'type',
        'is_active',
    ];

    protected $casts = [
        'price' => 'decimal:2',
        'min_limit' => 'decimal:2',
        'max_limit' => 'decimal:2',
        'available_amount' => 'decimal:8',
        'is_active' => 'boolean',
    ];

    public function seller(): BelongsTo
    {
        return $this->belongsTo(User::class, 'seller_id');
    }

    public function trades(): HasMany
    {
        return $this->hasMany(P2PTrade::class, 'offer_id');
    }
}
