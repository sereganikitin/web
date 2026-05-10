#!/usr/bin/env bash
# Server-side deploy: вызывается на VPS при каждом обновлении кода.
# Предполагается, что код уже обновлён (git reset --hard) GitHub Action'ом.
set -euo pipefail

cd "$(dirname "$0")/.."
APP_NAME="web-cd-agency"
APP_PORT=3000

echo "▸ deploy: $(pwd)"

# Если на сервере используется nvm, прогружаем его (для cron/CI без логин-shell)
if [ -z "${NVM_DIR:-}" ] && [ -d "$HOME/.nvm" ]; then
  export NVM_DIR="$HOME/.nvm"
fi
# shellcheck disable=SC1091
[ -s "${NVM_DIR:-}/nvm.sh" ] && . "${NVM_DIR}/nvm.sh"

echo "▸ npm ci"
npm ci --no-audit --no-fund

echo "▸ db:init (миграции идемпотентны)"
npm run db:init

echo "▸ build"
npm run build

# Чистый перезапуск. Запускаем next напрямую (а не через npm),
# иначе pm2 управляет npm-обёрткой, а её дочерний next-server остаётся
# orphan'ом при рестарте и держит порт → EADDRINUSE.
echo "▸ pm2: clean restart"
pm2 delete "$APP_NAME" 2>/dev/null || true
if command -v fuser >/dev/null 2>&1; then
  fuser -k "${APP_PORT}/tcp" 2>/dev/null || true
fi
sleep 1
pm2 start node_modules/next/dist/bin/next --name "$APP_NAME" -- start -p "$APP_PORT"
pm2 save

echo "✓ deploy ok"
