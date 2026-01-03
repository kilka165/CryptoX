<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class P2PTrade extends Model
{
    protected $table = 'p2p_trades';

    protected $fillable = [
        'offer_id',
        'buyer_id',
        'amount',
        'crypto_amount',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:2',
        'crypto_amount' => 'decimal:8',
    ];

    public function offer(): BelongsTo
    {
        return $this->belongsTo(P2POffer::class, 'offer_id');
    }

    public function buyer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }
}
