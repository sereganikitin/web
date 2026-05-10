#!/usr/bin/env bash
# Server-side deploy: вызывается на VPS при каждом обновлении кода.
# Предполагается, что код уже обновлён (git reset --hard) GitHub Action'ом.
set -euo pipefail

cd "$(dirname "$0")/.."
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

echo "▸ pm2 restart"
if pm2 describe web-cd-agency >/dev/null 2>&1; then
  pm2 restart web-cd-agency --update-env
else
  pm2 start npm --name web-cd-agency -- start
fi
pm2 save

echo "✓ deploy ok"
