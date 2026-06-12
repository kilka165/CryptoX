# CryptoX

Учебная платформа для обмена криптовалют на стеке **Laravel (Backend)** и **Next.js (Frontend)**. Пользователи регистрируются с подтверждением e-mail, управляют кошельком и активами, смотрят курсы и графики в реальном времени, торгуют, конвертируют, стейкают и обмениваются через P2P. Интерфейс адаптивный, с тёмной/светлой темой и поддержкой трёх языков (русский, английский, казахский).

## Основные возможности

- **Аутентификация и безопасность**
  - Регистрация с подтверждением e-mail по 6-значному коду
  - Вход с поддержкой двухфакторной аутентификации (TOTP, Google Authenticator)
  - Восстановление пароля по коду на e-mail, смена пароля из настроек
  - Токены Laravel Sanctum (Bearer), троттлинг на чувствительных эндпоинтах
- **Кошелёк**: баланс в выбранной фиатной валюте, пополнение и вывод средств
- **Торговля**: покупка и продажа криптовалюты по текущему курсу с валидацией баланса
- **Конвертация (Swap)**: обмен одного актива на другой, в том числе мульти-своп
- **P2P**: создание объявлений, сделки между пользователями, подтверждение и отмена
- **Стейкинг**: гибкие и фиксированные планы, просмотр и закрытие позиций
- **Портфолио и история**: список активов с текущей стоимостью, полный лог операций и статистика
- **Рынок**: список монет, страница монеты, графики цен (свечи) и статистика за 24 часа
- **Мультивалютность**: отображение стоимости в разных фиатных валютах по актуальным курсам
- **Комиссии**: прозрачная комиссия 1% на сделки и вывод (рассчитывается на бэкенде)
- **Профиль**: загрузка и редактирование аватара, пользовательские настройки
- **Локализация**: русский, английский, казахский (react-i18next)
- **Темы**: тёмная и светлая (next-themes)

## Технический стек

### Backend (API)
- **PHP**: 8.2+ (на проде зафиксирован 8.4, см. `backend/Dockerfile`)
- **Framework**: Laravel 12
- **База данных**: PostgreSQL
- **Auth**: Laravel Sanctum
- **2FA**: pragmarx/google2fa
- **API**: RESTful

### Frontend (Client)
- **Framework**: Next.js 16 (App Router), React 19
- **Язык**: TypeScript
- **Стили**: Tailwind CSS 4
- **Графики**: lightweight-charts
- **Иконки**: Lucide React
- **HTTP-клиент**: Axios
- **Локализация**: i18next / react-i18next
- **Темы**: next-themes
- **QR для 2FA**: qrcode.react

---

## Установка и запуск

### Предварительные требования
- PHP >= 8.2
- Composer
- Node.js >= 18
- PostgreSQL
- Git

### 1. Backend (Laravel)

Клонируйте репозиторий:

    git clone https://github.com/kilka165/CryptoX.git
    cd CryptoX/backend

Установите зависимости:

    composer install

Создайте файл окружения и сгенерируйте ключ:

    cp .env.example .env
    php artisan key:generate

Настройте подключение к PostgreSQL в `.env`:

    DB_CONNECTION=pgsql
    DB_HOST=127.0.0.1
    DB_PORT=5432
    DB_DATABASE=cryptox
    DB_USERNAME=postgres
    DB_PASSWORD=

Примените миграции (и при необходимости заполните тестовыми данными):

    php artisan migrate
    php artisan db:seed

Запустите сервер:

    php artisan serve

Backend будет доступен по адресу `http://127.0.0.1:8000`.

> Отправка кодов на e-mail по умолчанию пишется в лог (`MAIL_MAILER=log`). Для реальной отправки настройте SMTP в `.env` (пример с Gmail SMTP есть в `.env.example`).

### 2. Frontend (Next.js)

В новом терминале:

    cd CryptoX/frontend

Установите зависимости:

    npm install

При необходимости укажите URL API в `.env.local` (по умолчанию используется `http://localhost:8000/api`):

    NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

Запустите режим разработки:

    npm run dev

Frontend будет доступен по адресу `http://localhost:3000`.

---

## Конфигурация

### CORS

В `config/cors.php` разрешены запросы с фронтенда. Для локальной разработки это `http://localhost:3000`. Для прода адрес фронта задаётся переменной `FRONTEND_URL`.

### Комиссии

Ставки задаются в `.env` и доступны на публичном эндпоинте `GET /api/fees`:

    FEE_TRADE_PERCENT=0.01     # 1% на сделки
    FEE_WITHDRAW_PERCENT=0.01  # 1% на вывод

Итоговая сумма комиссии всегда пересчитывается на бэкенде.

---

## API Endpoints

### Аутентификация и безопасность
- `POST /api/register` — регистрация
- `POST /api/register/verify` — подтверждение регистрации кодом
- `POST /api/register/verify/resend` — повторная отправка кода
- `POST /api/login` — вход
- `POST /api/login/2fa` — подтверждение входа по 2FA
- `POST /api/password/forgot` — запрос кода для сброса пароля
- `POST /api/password/reset` — сброс пароля по коду
- `POST /api/logout` — выход (auth)
- `POST /api/email/verify/send`, `POST /api/email/verify` — верификация e-mail (auth)
- `POST /api/password/change` — смена пароля (auth)
- `POST /api/2fa/enable`, `/api/2fa/confirm`, `/api/2fa/disable` — управление 2FA (auth)

### Пользователь и настройки
- `GET /api/user` — профиль (auth)
- `GET /api/user/settings`, `PUT /api/user/settings` — настройки (auth)
- `PUT /api/user/settings/currency` — смена валюты отображения (auth)
- `POST /api/user/avatar`, `DELETE /api/user/avatar` — аватар (auth)
- `GET /api/exchange-rate` — курс для конвертации (auth)

### Кошелёк
- `GET /api/wallet/balance` — баланс (auth)
- `POST /api/wallet/deposit` — пополнение (auth)
- `POST /api/wallet/withdraw` — вывод (auth)
- `GET /api/user/assets` — активы пользователя (auth)

### Торговля и конвертация
- `POST /api/trade/buy` — покупка (auth)
- `POST /api/trade/sell` — продажа (auth)
- `POST /api/trade/swap` — обмен актива (auth)
- `POST /api/trade/multi-swap` — мульти-своп (auth)
- `POST /api/trade/calculate-rates` — расчёт курсов (auth)

### Транзакции
- `GET /api/transactions` — список (auth)
- `GET /api/transactions/history` — история (auth)
- `GET /api/transactions/stats` — статистика (auth)

### P2P
- `GET /api/p2p/offers`, `GET /api/p2p/offers/{id}` — объявления (публичные)
- `POST /api/p2p/offers`, `DELETE /api/p2p/offers/{id}` — управление объявлениями (auth)
- `POST /api/p2p/trades` — создать сделку (auth)
- `GET /api/p2p/trades/my` — мои сделки (auth)
- `POST /api/p2p/trades/{id}/confirm`, `/cancel` — подтверждение и отмена (auth)

### Стейкинг
- `GET /api/staking/plans` — планы (публичный)
- `GET /api/staking/assets`, `GET /api/staking/my` — доступные активы и позиции (auth)
- `POST /api/staking/stake` — застейкать (auth)
- `POST /api/staking/unstake/{id}`, `POST /api/staking/cancel/{id}` — закрытие позиции (auth)

### Рынок и валюты
- `GET /api/coins` — список монет
- `GET /api/coins/prices`, `GET /api/coins/price/{symbol}` — цены
- `GET /api/coins/stats/{symbol}` — статистика за 24ч
- `GET /api/coins/klines/{symbol}` — свечи для графика
- `GET /api/coins/{coinId}` — детали монеты
- `GET /api/currencies`, `/api/currencies/all`, `/api/currency/rates` — валюты и курсы
- `GET /api/assets` — список активов
- `GET /api/fees` — текущие ставки комиссий

---

## Тестирование

### Backend

    cd backend
    php artisan test

### Frontend

    cd frontend
    npm run lint

---

## Локализация

Словари переводов лежат в `frontend/locales/{ru,en,kk}/translation.json`. Все три языка держатся в паритете по ключам — при добавлении строки обновляйте все три файла.

---

## Деплой

Схема развёртывания: фронтенд (Next.js) на **Vercel**, бэкенд (Laravel) и **PostgreSQL** на **Railway**. Пошаговая инструкция со списком переменных окружения — в [DEPLOY.md](DEPLOY.md).

---

## Структура проекта

    CryptoX/
    ├── backend/                 # Laravel API
    │   ├── app/
    │   │   ├── Http/Controllers/  # API-контроллеры
    │   │   └── Models/            # Eloquent-модели
    │   ├── config/               # Конфигурация (cors, fees и т.д.)
    │   ├── database/
    │   │   ├── migrations/       # Миграции БД
    │   │   └── seeders/          # Сидеры
    │   ├── routes/api.php        # API-маршруты
    │   └── Dockerfile            # Образ для Railway
    ├── frontend/                # Next.js (App Router)
    │   ├── app/                  # Маршруты и страницы
    │   ├── components/           # React-компоненты
    │   ├── locales/              # Переводы ru / en / kk
    │   └── lib/                  # Конфиг и утилиты
    ├── DEPLOY.md                # Инструкция по деплою
    └── README.md

---

## Лицензия

Распространяется под лицензией **MIT**.
