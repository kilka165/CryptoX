# CryptoX 🚀

Современная платформа для обмена криптовалют, построенная на стеке **Laravel (Backend)** и **Next.js (Frontend)**. Приложение позволяет пользователям регистрироваться, управлять своим кошельком, просматривать курсы валют в реальном времени и совершать сделки по покупке и продаже криптоактивов.

## 📋 Основные возможности

- 🔐 **Аутентификация**: Безопасная регистрация и вход пользователей (Laravel Sanctum)
- 💰 **Кошелек**: Просмотр баланса в фиатной валюте и криптовалютах
- 📈 **Торговля**:
  - Покупка криптовалюты по текущему курсу
  - Продажа активов с мгновенным зачислением средств
  - Валидация баланса и защита от ошибочных транзакций
- 📊 **Портфолио**: Отображение списка активов пользователя с их текущей стоимостью
- 📜 **История транзакций**: Полный лог операций (покупки, продажи, депозиты)
- 🎨 **UI/UX**: Адаптивный интерфейс с поддержкой темной/светлой темы (Tailwind CSS)
- 🔄 **Реальные данные**: Интеграция с Binance API для актуальных курсов

## 🛠 Технический стек

### Backend (API)
- **PHP**: 8.3+
- **Framework**: Laravel 10/11
- **Database**: MySQL
- **Auth**: Laravel Sanctum
- **API**: RESTful API
- **Интеграции**: Binance API

### Frontend (Client)
- **Framework**: Next.js (React)
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **HTTP Client**: Axios
- **State Management**: React Hooks
- **TypeScript**: Для типизации и безопасности кода

---

## 🚀 Установка и запуск

Следуйте этим инструкциям, чтобы запустить проект локально.

### Предварительные требования

- PHP >= 8.3
- Composer
- Node.js >= 18
- MySQL
- Git

### 1. Настройка Backend (Laravel)

Клонируйте репозиторий
git clone https://github.com/kilka165/CryptoX.git
cd CryptoX/backend

Установите зависимости
composer install

Создайте файл окружения
cp .env.example .env

Сгенерируйте ключ приложения
php artisan key:generate

Настройте базу данных в .env файле
DB_DATABASE=crypto_exchange
DB_USERNAME=root
DB_PASSWORD=

Запустите миграции
php artisan migrate

(Опционально) Заполните базу тестовыми данными
php artisan db:seed

Запустите локальный сервер
php artisan serve

Backend будет доступен по адресу: `http://127.0.0.1:8000`

### 2. Настройка Frontend (Next.js)


Откройте новый терминал и перейдите в папку frontend
cd CryptoX/frontend

Установите зависимости
npm install
или
yarn install

Создайте файл .env.local (если требуется) и укажите API URL
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000/api

Запустите режим разработки
npm run dev
или
yarn dev

Frontend будет доступен по адресу: `http://localhost:3000`

---

## 📊 Структура базы данных

Проект использует следующие основные таблицы:

- `users` - Данные пользователей (email, password, timestamps)
- `wallets` - Фиатный баланс пользователя (user_id, balance)
- `assets` - Криптовалютные активы пользователя (user_id, symbol, amount)
- `transactions` - История операций (user_id, type, amount, symbol, price, timestamps)

### Диаграмма связей


users (1) ─── (1) wallets
users (1) ─── (*) assets
users (1) ─── (*) transactions




## 🔧 Конфигурация

### CORS настройки

Убедитесь, что настроили **CORS** в Laravel (`config/cors.php`), чтобы разрешить запросы с `http://localhost:3000`:


'allowed_origins' => ['http://localhost:3000'],
'supports_credentials' => true,


### API ключи

Для работы с внешними API добавьте в `.env`:


BINANCE_API_KEY=your_binance_api_key
BINANCE_API_SECRET=your_binance_api_secret


---

## 📡 API Endpoints

Некоторые ключевые эндпоинты:

### Аутентификация
- `POST /api/register` - Регистрация нового пользователя
- `POST /api/login` - Вход в систему
- `POST /api/logout` - Выход из системы
- `GET /api/user` - Получение данных профиля (требует auth)

### Торговля
- `POST /api/trade/buy` - Покупка актива
- `POST /api/trade/sell` - Продажа актива

### Данные пользователя
- `GET /api/assets` - Получение портфолио
- `GET /api/transactions` - История транзакций
- `GET /api/wallet` - Баланс кошелька

### Рынок
- `GET /api/market/prices` - Актуальные курсы криптовалют

---

## 🧪 Тестирование

### Backend тесты

cd backend
php artisan test


### Frontend тесты

cd frontend
npm run test

---

## 📂 Структура проекта

CryptoX/

├── backend/              # Laravel API

│   ├── app/

│   │   ├── Http/

│   │   │   └── Controllers/  # API контроллеры

│   │   └── Models/           # Eloquent модели

│   ├── config/               # Конфигурация Laravel

│   ├── database/

│   │   ├── migrations/       # Миграции БД

│   │   └── seeders/          # Сидеры

│   └── routes/

│       └── api.php           # API маршруты

├── frontend/             # Next.js приложение

│   ├── components/           # React компоненты

│   ├── pages/                # Страницы Next.js

│   ├── public/               # Статические файлы

│   └── styles/               # Tailwind CSS

└── README.md


## 🤝 Вклад в проект (Contributing)

Мы приветствуем вклад сообщества! Следуйте этим шагам:

1. Форкните репозиторий
2. Создайте ветку для новой фичи (`git checkout -b feature/AmazingFeature`)
3. Закоммитьте изменения (`git commit -m 'Add some AmazingFeature'`)
4. Запушьте ветку (`git push origin feature/AmazingFeature`)
5. Откройте Pull Request

---

## 📝 Roadmap

- [ ] Добавление двухфакторной аутентификации (2FA)
- [ ] Интеграция с дополнительными биржами (Kraken, Coinbase)
- [ ] Реализация P2P обмена
- [ ] Мобильное приложение (React Native)
- [ ] Расширенная аналитика портфолио
- [ ] Уведомления о изменении цен (WebSocket)

---

## 🐛 Известные проблемы

- Обновление цен в реальном времени требует настройки WebSocket
- Лимиты API бирж могут вызывать временные задержки

---

## 📄 Лицензия

Распространяется под лицензией **MIT**. Подробнее см. [LICENSE](LICENSE).

---


## 🙏 Благодарности

- [Laravel](https://laravel.com/) - За мощный PHP фреймворк
- [Next.js](https://nextjs.org/) - За React фреймворк
- [Tailwind CSS](https://tailwindcss.com/) - За utility-first CSS
- [Binance API](https://binance-docs.github.io/apidocs/) - За данные о криптовалютах

---

⭐ Если проект был полезен, поставьте звезду на GitHub!
```



