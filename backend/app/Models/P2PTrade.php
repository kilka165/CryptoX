<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class P2PTrade extends Model
{
    use HasFactory;

    protected $fillable = [
        'offer_id',
        'buyer_id',
        'seller_id',
        'crypto_currency',
        'currency',
        'amount',
        'price',
        'total_fiat',
        'status',
    ];

    protected $casts = [
        'amount' => 'decimal:8',
        'price' => 'decimal:2',
        'total_fiat' => 'decimal:2',
    ];

    /**
     * Получить заявку
     */
    public function offer()
    {
        return $this->belongsTo(P2POffer::class, 'offer_id');
    }

    /**
     * Получить покупателя
     */
    public function buyer()
    {
        return $this->belongsTo(User::class, 'buyer_id');
    }

    /**
     * Получить продавца
     */
    public function seller()
    {
        return $this->belongsTo(User::class, 'seller_id');
    }
}
