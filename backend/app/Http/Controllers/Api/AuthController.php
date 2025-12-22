<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    // РЕГИСТРАЦИЯ
    public function register(Request $request)
    {
        // 1. Валидация данных
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users',
            'password' => 'required|string|min:8',
        ]);

        // 2. Создание пользователя
        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
        ]);

        // 3. Выдача токена (сразу входим)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'message' => 'Пользователь успешно зарегистрирован',
            'user' => $user,
            'token' => $token,
        ], 201);
    }

    // ВХОД
     public function login(Request $request)
    {
        // 1. Валидация входных данных
        $fields = $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // 2. Поиск пользователя по Email
        $user = User::where('email', $fields['email'])->first();

        // 3. Проверка пользователя и пароля
        // Если юзера нет ИЛИ пароль не совпадает
        if (!$user || !Hash::check($fields['password'], $user->password)) {
            return response()->json([
                'message' => 'Неверный email или пароль'
            ], 401);
        }

        // 4. Выдача токена (если всё ок)
        $token = $user->createToken('auth_token')->plainTextToken;

        return response()->json([
            'user' => $user,
            'token' => $token,
        ], 200);
    }

    public function updateSettings(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'currency' => 'required|string|size:3'
        ]);

        $user = $request->user();
        $user->update($validated);

        return response()->json(['message' => 'Настройки сохранены', 'user' => $user]);
    }
    // ПОЛУЧЕНИЕ ПРОФИЛЯ
    public function user(Request $request)
    {
        return $request->user();
    }
    
    // ВЫХОД
    public function logout(Request $request)
    {
        $request->user()->currentAccessToken()->delete();
        return response()->json(['message' => 'Выход выполнен']);
    }

    
}

