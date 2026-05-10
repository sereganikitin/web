#!/usr/bin/env bash
# First-time setup на чистом VPS под web.cd-agency.ru.
# Запускать на сервере. Скрипт идемпотентен: можно перезапускать.
set -euo pipefail

REPO="${REPO:-https://github.com/sereganikitin/web.git}"
TARGET="${TARGET:-/var/www/web.cd-agency.ru}"
APP_NAME="web-cd-agency"

echo "▸ bootstrap: repo=$REPO target=$TARGET"

# 1. Проверки окружения
command -v node >/dev/null 2>&1 || {
  echo "✕ Node.js не найден. Установите Node 22+ (рекомендуется 24)."
  exit 1
}
NODE_MAJOR="$(node -p 'parseInt(process.versions.node)')"
if [ "$NODE_MAJOR" -lt 22 ]; then
  echo "✕ Нужен Node.js 22+, у вас $(node -v)"
  exit 1
fi
command -v git >/dev/null 2>&1 || { echo "✕ git не найден"; exit 1; }
command -v pm2 >/dev/null 2>&1 || {
  echo "▸ Устанавливаю pm2 глобально"
  npm install -g pm2
}

# 2. Клон при первом запуске
if [ ! -d "$TARGET/.git" ]; then
  echo "▸ git clone $REPO → $TARGET"
  mkdir -p "$(dirname "$TARGET")"
  git clone "$REPO" "$TARGET"
else
  echo "▸ Репозиторий уже клонирован, обновляю"
  cd "$TARGET"
  git fetch --quiet origin main
  git reset --hard origin/main
fi

cd "$TARGET"

# 3. .env
if [ ! -f ".env" ]; then
  echo "▸ Генерирую .env (нужно отредактировать!)"
  cp .env.example .env
  SECRET="$(node -e "console.log(require('crypto').randomBytes(48).toString('base64'))")"
  # macOS sed vs GNU sed
  if sed --version >/dev/null 2>&1; then
    sed -i "s|^SESSION_SECRET=.*|SESSION_SECRET=$SECRET|" .env
  else
    sed -i '' "s|^SESSION_SECRET=.*|SESSION_SECRET=$SECRET|" .env
  fi
  echo ""
  echo "════════════════════════════════════════════════════════════"
  echo "  .env создан с автогенерированным SESSION_SECRET."
  echo "  ВАЖНО: отредактируйте $TARGET/.env"
  echo "         — поменяйте ADMIN_LOGIN и ADMIN_PASSWORD"
  echo "         — затем запустите этот скрипт ещё раз"
  echo "════════════════════════════════════════════════════════════"
  exit 0
fi
chmod 600 .env

# 4. Установка и сборка
echo "▸ npm ci"
npm ci --no-audit --no-fund

echo "▸ db:init (создание таблиц + сид + admin)"
npm run db:init

echo "▸ build"
npm run build

# 5. PM2 (clean restart: запускаем next напрямую, без npm-обёртки)
echo "▸ pm2: clean restart"
pm2 delete "$APP_NAME" 2>/dev/null || true
if command -v fuser >/dev/null 2>&1; then
  fuser -k 3000/tcp 2>/dev/null || true
fi
sleep 1
pm2 start node_modules/next/dist/bin/next --name "$APP_NAME" -- start -p 3000
pm2 save

echo ""
echo "✓ Bootstrap завершён. Приложение слушает 127.0.0.1:3000"
echo ""
echo "Следующие шаги (вручную):"
echo "  1. Настроить nginx-конфиг для web.cd-agency.ru — см. README."
echo "  2. Получить SSL: certbot --nginx -d web.cd-agency.ru"
echo "  3. Настроить DNS: A-запись web.cd-agency.ru → IP сервера"
echo "  4. Добавить SSH deploy-key в GitHub Secrets для автодеплоя — см. README."
echo "  5. Один раз настроить автозапуск pm2: pm2 startup (потом скопируйте"
echo "     показанную команду и выполните её под root)."
