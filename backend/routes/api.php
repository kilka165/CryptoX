<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\TradeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CoinsController;
use App\Http\Controllers\Api\UserSettingsController;

// ========================================
// 🔓 ПУБЛИЧНЫЕ РОУТЫ (БЕЗ АВТОРИЗАЦИИ)
// ========================================

// Аутентификация
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

// Список монет (ПУБЛИЧНЫЕ - доступны всем!)
Route::get('/coins', [CoinsController::class, 'index']);
Route::get('/coins/price/{symbol}', [CoinsController::class, 'getPrice']);
Route::get('/coins/stats/{symbol}', [CoinsController::class, 'get24hStats']);
Route::post('/coins/sync', [CoinsController::class, 'index']);
Route::get('/coins/{coinId}', [CoinsController::class, 'show']);
Route::get('/coins-db/all', [CoinsController::class, 'fromDatabase']);
Route::get('/coins-db/{coinId}/icon', [CoinsController::class, 'getCoinIcon']);

// ========================================
// 🔐 ЗАЩИЩЁННЫЕ РОУТЫ (ТРЕБУЮТ АВТОРИЗАЦИИ)
// ========================================

Route::middleware('auth:sanctum')->group(function () {

    // ========== ПОЛЬЗОВАТЕЛЬ ==========

    // Получение профиля
    Route::get('/user', function (Request $request) {
        $user = $request->user()->load(['wallet', 'assets']);
        return response()->json([
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'currency' => $user->currency ?? 'USD',
            'wallet' => $user->wallet,
            'assets' => $user->assets,
            'balance' => $user->wallet->balance ?? 0,
        ]);
    });

    // Выход
    Route::post('/logout', [AuthController::class, 'logout']);

    // ========== НАСТРОЙКИ ПОЛЬЗОВАТЕЛЯ ==========

    Route::get('/user/settings', [UserSettingsController::class, 'getSettings']);
    Route::put('/user/settings', [AuthController::class, 'updateSettings']);
    Route::put('/user/settings/currency', [UserSettingsController::class, 'updateCurrency']);
    Route::get('/exchange-rate', [UserSettingsController::class, 'getExchangeRate']);

    // ========== КОШЕЛЁК ==========

    Route::get('/wallet', [WalletController::class, 'getBalance']);
    Route::get('/wallet/balance', [WalletController::class, 'getBalance']);
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
    Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']);
    Route::get('/user/assets', [WalletController::class, 'userAssets']);

    // ========== ТОРГОВЛЯ ==========

    Route::post('/trade/buy', [TradeController::class, 'buy']);
    Route::post('/trade/sell', [TradeController::class, 'sell']);
    Route::post('/trade/swap', [TradeController::class, 'swap']);
    Route::post('/trade/multi-swap', [TradeController::class, 'multiSwap']);
    Route::post('/trade/calculate-rates', [TradeController::class, 'calculateRates']);

    // ========== ТРАНЗАКЦИИ ==========

    Route::get('/transactions', [TransactionController::class, 'index']);
    Route::get('/transactions/history', [TransactionController::class, 'getHistory']);
    Route::get('/transactions/stats', [TransactionController::class, 'getStats']);
});
