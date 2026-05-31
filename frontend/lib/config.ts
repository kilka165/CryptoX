// Базовый адрес backend API.
// В продакшене задаётся переменной окружения NEXT_PUBLIC_API_URL
// (например, https://cryptox-backend.up.railway.app/api).
// Локально по умолчанию используется dev-сервер Laravel.
export const API_BASE =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:8000/api";
