# 🚀 Деплой CryptoX

Схема: **фронт (Next.js) → Vercel**, **бэк (Laravel) + PostgreSQL → Railway**.
Авторизация на Bearer-токенах, поэтому разные домены проблем не создают.

---

## 0. Подготовка (один раз)

Сгенерируй `APP_KEY` для Laravel — он понадобится на шаге 1:

```bash
cd backend
php artisan key:generate --show
# скопируй вывод целиком, вместе с префиксом base64:...
```

Запушь текущие изменения в GitHub (Railway и Vercel деплоят из репозитория):

```bash
git add .
git commit -m "chore: deploy config (env-based API URL, Dockerfile, CORS)"
git push
```

---

## 1. Бэкенд + БД на Railway

1. Зайди на [railway.app](https://railway.app) → **New Project** → **Deploy from GitHub repo** → выбери `CryptoX`.
2. После создания сервиса открой его → **Settings**:
   - **Root Directory**: `backend`  ← обязательно, иначе Railway не найдёт Dockerfile.
   - Build сам подхватит `backend/Dockerfile` (указано в `railway.json`).
3. Добавь базу: в проекте **New** → **Database** → **Add PostgreSQL**.
4. Открой сервис бэкенда → вкладка **Variables** и задай переменные
   (см. `backend/.env.railway.example`):

   | Переменная | Значение |
   |---|---|
   | `APP_NAME` | `CryptoX` |
   | `APP_ENV` | `production` |
   | `APP_DEBUG` | `false` |
   | `APP_KEY` | `base64:...` (из шага 0) |
   | `APP_URL` | `https://<домен-бэка>.up.railway.app` |
   | `DB_CONNECTION` | `pgsql` |
   | `DB_URL` | `${{Postgres.DATABASE_URL}}` ← ссылка на сервис Postgres |
   | `SESSION_DRIVER` | `database` |
   | `CACHE_STORE` | `database` |
   | `QUEUE_CONNECTION` | `sync` |
   | `LOG_CHANNEL` | `stderr` |
   | `LOG_LEVEL` | `error` |
   | `FRONTEND_URL` | `https://<домен-фронта>.vercel.app` (заполнишь после шага 2) |

   > `DB_URL` вводи именно как `${{Postgres.DATABASE_URL}}` — Railway сам подставит
   > строку подключения к Postgres. Если сервис Postgres называется иначе, поправь имя.

5. Включи публичный домен: **Settings → Networking → Generate Domain**.
   Получишь адрес вида `https://cryptox-production-xxxx.up.railway.app`.
6. Дождись деплоя. Контейнер при старте сам:
   - применяет миграции (`php artisan migrate --force`),
   - кэширует конфиг,
   - поднимает Apache на нужном порту.
   Проверь здоровье: открой `https://<домен-бэка>.up.railway.app/up` → должно быть **200**.

---

## 2. Фронтенд на Vercel

1. Зайди на [vercel.com](https://vercel.com) → **Add New → Project** → импортируй репозиторий `CryptoX`.
2. В настройках импорта:
   - **Root Directory**: `frontend`
   - Framework Preset определится как **Next.js** автоматически.
3. Добавь переменную окружения (**Environment Variables**):

   | Переменная | Значение |
   |---|---|
   | `NEXT_PUBLIC_API_URL` | `https://<домен-бэка>.up.railway.app/api` |

   > Важно: с суффиксом `/api` на конце и **без** завершающего слэша.
4. **Deploy**. Получишь адрес вида `https://cryptox.vercel.app`.

---

## 3. Связать домены (CORS)

1. Вернись в Railway → переменные бэкенда → задай
   `FRONTEND_URL = https://<твой-домен>.vercel.app` (точный адрес из Vercel).
2. Railway передеплоит бэк. Превью-деплои Vercel (`*.vercel.app`) уже разрешены
   паттерном в `config/cors.php`, но основной домен лучше указать явно.

---

## 4. Проверка

- Открой фронт на Vercel → зарегистрируйся / войди.
- Открой DevTools → Network: запросы должны идти на Railway-домен и возвращать 200.
- Если видишь ошибку CORS — проверь, что `FRONTEND_URL` совпадает с доменом фронта
  один в один (схема + хост, без слэша на конце).

---

## Заметки и ограничения

- **Фоновые задачи**: `QUEUE_CONNECTION=sync` — задачи выполняются синхронно в запросе.
  Отдельного воркера на Railway нет; для демо этого достаточно.
- **Файлы**: контейнер эфемерный — загруженные файлы не переживут передеплой.
  Для демо некритично; для прода нужен S3-совместимый диск.
- **PHP 8.4** — зафиксирован в `backend/Dockerfile` (зависимости из `composer.lock`
  требуют ≥ 8.4). Поднять до 8.5 — поменять одну строку `FROM php:8.5-apache`.
- **Локальная разработка не сломалась**: без `NEXT_PUBLIC_API_URL` фронт по умолчанию
  ходит на `http://localhost:8000/api` (см. `frontend/lib/config.ts`).
