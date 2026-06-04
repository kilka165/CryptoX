<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Services\FeeService;

class ConfigController extends Controller
{
    /**
     * Публичные ставки комиссий для фронтенда (доли: 0.01 = 1%).
     */
    public function fees(FeeService $fees)
    {
        return response()->json([
            'trade'    => $fees->rate('trade'),
            'withdraw' => $fees->rate('withdraw'),
        ]);
    }
}
