<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\WalletController;
use App\Http\Controllers\Api\TradeController;
use App\Http\Controllers\TransactionController;
use App\Http\Controllers\CoinsController;


// 🔓 Без защиты (публичные)
Route::post('/register', [AuthController::class, 'register']);
Route::post('/login', [AuthController::class, 'login']);

Route::middleware('api')->group(function () {
    // Синхронизировать иконки с API
    Route::post('/coins/sync', [CoinsController::class, 'index']);

    // Получить монету из API и сохранить
    Route::get('/coins/{coinId}', [CoinsController::class, 'show']);

    // Получить все монеты из БД
    Route::get('/coins-db/all', [CoinsController::class, 'fromDatabase']);

    // Получить иконку монеты из БД
    Route::get('/coins-db/{coinId}/icon', [CoinsController::class, 'getCoinIcon']);
});

// 🔐 С защитой (нужен токен)
Route::middleware('auth:sanctum')->group(function () {
    // Получение профиля
    Route::get('/user', function (Request $request) {
        return $request->user()->load(['wallet', 'assets']);
    });


    // Кошельки
    Route::get('/wallet', [WalletController::class, 'getBalance']);
    Route::post('/wallet/deposit', [WalletController::class, 'deposit']);
    Route::get('/user/assets', [WalletController::class, 'userAssets']);

    // Торговля
    Route::post('/trade/buy', [TradeController::class, 'buy']);
    Route::post('/trade/sell', [TradeController::class, 'sell']);
    Route::post('/trade/swap', [TradeController::class, 'swap']);
    Route::post('/trade/multi-swap', [TradeController::class, 'multiSwap']);

    // 👈 ПЕРЕМЕСТИЛ СЮДА - ВСЕ ТРАНЗАКЦИИ
    Route::get('/transactions/history', [TransactionController::class, 'getHistory']);
    Route::get('/transactions/stats', [TransactionController::class, 'getStats']);

    // Настройки
    Route::put('/user/settings', [AuthController::class, 'updateSettings']);
    Route::post('/wallet/withdraw', [WalletController::class, 'withdraw']);



});
