<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\TradeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CoinsController;
use App\Http\Controllers\Api\UserSettingsController;
use App\Http\Controllers\CurrencyController;
use App\Http\Controllers\P2PController;
use App\Http\Controllers\StakingController;
use App\Http\Controllers\AssetController;

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
Route::get('/coins/{coinId}', [CoinsController::class, 'show']);

// Валюты
Route::get('/currencies', [CurrencyController::class, 'getSupportedCurrencies']);
Route::get('/currencies/all', [CurrencyController::class, 'getAllCurrencies']);
Route::get('/currency/rates', [CurrencyController::class, 'getRates']);

// Активы (публичный список для фильтров)
Route::get('/assets', [AssetController::class, 'index']);

// P2P (публичные)
Route::get('/p2p/offers', [P2PController::class, 'getOffers']);
Route::get('/p2p/offers/{id}', [P2PController::class, 'getOffer']);

// Стейкинг (публичные)
Route::get('/staking/plans', [StakingController::class, 'getPlans']);

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

    // ========== P2P ==========

    Route::post('/p2p/offers', [P2PController::class, 'createOffer']);
    Route::post('/p2p/trades', [P2PController::class, 'createTrade']);
    Route::get('/p2p/trades/my', [P2PController::class, 'getMyTrades']);
    Route::post('/p2p/trades/{id}/confirm', [P2PController::class, 'confirmTrade']);
    Route::post('/p2p/trades/{id}/cancel', [P2PController::class, 'cancelTrade']);
    Route::delete('/p2p/offers/{id}', [P2PController::class, 'deleteOffer']);

    // ========== СТЕЙКИНГ ==========

    Route::get('/staking/assets', [StakingController::class, 'getUserAssets']);
    Route::get('/staking/my', [StakingController::class, 'getMyStaking']);
    Route::post('/staking/stake', [StakingController::class, 'stake']);
    Route::post('/staking/unstake/{id}', [StakingController::class, 'unstake']);
    Route::post('/staking/cancel/{id}', [StakingController::class, 'cancelFlexible']);
});
