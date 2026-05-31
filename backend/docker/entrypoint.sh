#!/bin/sh
set -e

# Гарантируем РОВНО ОДИН MPM на старте (mod_php требует prefork).
# Делаем это в рантайме на реальной ФС контейнера — надёжнее, чем на этапе сборки:
# в некоторых средах загружается ещё и mpm_event → "More than one MPM loaded".
rm -f /etc/apache2/mods-enabled/mpm_event.* \
      /etc/apache2/mods-enabled/mpm_worker.* 2>/dev/null || true
a2enmod mpm_prefork >/dev/null 2>&1 || true

# Railway выдаёт порт через $PORT — Apache должен слушать именно его (по умолчанию 80).
: "${PORT:=80}"
sed -i "s/Listen 80/Listen ${PORT}/" /etc/apache2/ports.conf
sed -i "s/:80>/:${PORT}>/" /etc/apache2/sites-available/000-default.conf

# APP_KEY: лучше задать в переменных Railway. Если не задан — генерируем временный.
if [ -z "${APP_KEY}" ]; then
  APP_KEY="$(php artisan key:generate --show)"
  export APP_KEY
  echo "WARNING: APP_KEY не задан в окружении — сгенерирован временный. Задайте APP_KEY в Railway, иначе сессии/токены сбросятся при перезапуске."
fi

# Миграции (--force, т.к. прод). Не валим контейнер, если БД ещё поднимается.
php artisan migrate --force || echo "WARNING: миграции не выполнились (БД ещё не готова?)."

# Линк storage (для публичных файлов), создаём только если его ещё нет.
[ -L public/storage ] || php artisan storage:link 2>/dev/null || true

# Кэш конфигурации. Роуты НЕ кэшируем — в routes/api.php есть closure-роут.
php artisan config:cache || true

exec apache2-foreground
