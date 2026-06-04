<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class PlatformAccount extends Model
{
    protected $fillable = [
        'currency',
        'balance',
    ];

    protected $casts = [
        'balance' => 'decimal:2',
    ];
}
