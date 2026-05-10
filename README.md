# web.cd-agency.ru — сайт-визитка Сергея Никитина

Сайт-визитка веб-разработчика на Next.js 16 + встроенный `node:sqlite`. Темная тема, бежевый акцент, секции: Hero, Услуги, Логотипы клиентов, Selected Work, Обо мне, Контакты. Админка с редактированием всего контента и загрузкой изображений.

## Стек

- **Next.js 16** (App Router, Turbopack, React 19) — фронт + API
- **node:sqlite** — встроенный SQLite в Node 22+ (без нативной сборки)
- **bcryptjs + jose** — авторизация админки (логин/пароль, JWT в httpOnly cookie)
- **sharp** — оптимизация загружаемых изображений (auto webp, max width 2400)
- **Tailwind CSS** — стили

## Требования

- Node.js **22.5+** (используется `node:sqlite`). Рекомендуется **24+**.
- На VPS — установленный Node.js + PM2 + nginx (как настроено для cd-agency.ru / photo.cd-agency.ru).

## Локальная разработка

```bash
cp .env.example .env
# отредактируй .env: SESSION_SECRET, ADMIN_LOGIN, ADMIN_PASSWORD
npm install
npm run db:init
npm run dev
```

Сайт: http://localhost:3000  
Админка: http://localhost:3000/admin (логин из `.env`)

## Сборка и продакшен-запуск

```bash
npm run build
npm start          # запуск на :3000
```

## Структура

```
src/
  app/
    page.tsx                  главная страница (Hero ... Footer)
    layout.tsx                root layout
    admin/                    админка
      layout.tsx              (с проверкой сессии)
      login/page.tsx
      page.tsx                дашборд
      content/                редактирование текстов
      portfolio/              CRUD кейсов
      logos/                  логотипы клиентов
      contacts/               контакты и соц.сети
    api/
      auth/{login,logout}/route.ts
      content/route.ts
      portfolio/route.ts + [id]/route.ts
      logos/route.ts + [id]/route.ts
      upload/route.ts         загрузка изображений
  components/                 секции главной
  lib/
    db.ts                     инициализация SQLite (node:sqlite)
    auth.ts                   сессии, верификация пароля
    content.ts                чтение/запись контента
  proxy.ts                    защита /admin (Next.js 16 proxy = бывший middleware)
data/site.db                  SQLite-файл (создаётся при db:init)
public/uploads/               загруженные изображения
scripts/init-db.mjs           создание таблиц + дефолтный контент + admin
```

## Админка

URL: `/admin`. Авторизация по логину/паролю из таблицы `admin_users` (создаётся при `npm run db:init` из переменных `ADMIN_LOGIN`/`ADMIN_PASSWORD`). Сессия — JWT в httpOnly cookie на 7 дней.

Можно править:
- **Тексты сайта** — `/admin/content`: hero, услуги, work, about, footer, SEO.
- **Портфолио** — `/admin/portfolio`: добавлять, редактировать, удалять кейсы. Поля: название, slug, категория, описание, изображение, ссылка, позиция, видимость.
- **Логотипы клиентов** — `/admin/logos`: лента под hero-блоком.
- **Контакты** — `/admin/contacts`: email, телефон, telegram, whatsapp, github.

Сменить пароль администратора:
```bash
# Удалите запись и заново создайте через init-db с новым паролем
ADMIN_LOGIN=admin ADMIN_PASSWORD=новый-пароль npm run db:init
# Старая запись с тем же логином не пересоздастся —
# либо измените ADMIN_LOGIN, либо удалите запись из data/site.db вручную
```

## Деплой на VPS под web.cd-agency.ru

После первоначальной настройки деплой автоматический: каждый push в `main` запускает GitHub Action, который по SSH делает `git pull + npm ci + build + pm2 restart` на VPS.

### Первичная настройка VPS (один раз)

Предполагается, что на сервере уже есть Node.js 22+ и nginx.

**1. Запустите bootstrap-скрипт.** Он установит pm2 (если его нет), клонирует репозиторий, создаст `.env` с автогенерированным `SESSION_SECRET`, попросит вас отредактировать админский логин/пароль, после чего соберёт проект и запустит через pm2:

```bash
ssh root@cd-agency.ru
curl -sSL https://raw.githubusercontent.com/sereganikitin/web/main/scripts/bootstrap.sh -o /tmp/bootstrap.sh
bash /tmp/bootstrap.sh
# После первой попытки — отредактируйте /var/www/web.cd-agency.ru/.env (ADMIN_LOGIN, ADMIN_PASSWORD)
bash /tmp/bootstrap.sh   # запустить ещё раз — теперь развернёт
```

**2. nginx-конфиг для поддомена**

`/etc/nginx/sites-available/web.cd-agency.ru`:

```nginx
server {
    listen 80;
    server_name web.cd-agency.ru;
    return 301 https://$host$request_uri;
}

server {
    listen 443 ssl http2;
    server_name web.cd-agency.ru;

    ssl_certificate     /etc/letsencrypt/live/web.cd-agency.ru/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/web.cd-agency.ru/privkey.pem;

    client_max_body_size 12M;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
sudo ln -s /etc/nginx/sites-available/web.cd-agency.ru /etc/nginx/sites-enabled/
sudo nginx -t && sudo systemctl reload nginx
sudo certbot --nginx -d web.cd-agency.ru
```

**3. DNS.** A-запись (или CNAME на основной домен) для `web.cd-agency.ru` → IP VPS.

**4. Автозапуск pm2 после ребута:**

```bash
pm2 startup    # покажет команду — выполните её
pm2 save
```

### Настройка автодеплоя через GitHub Actions (один раз)

Каждый push в `main` будет автоматически разворачиваться на VPS через workflow [.github/workflows/deploy.yml](.github/workflows/deploy.yml). Чтобы это заработало:

**1. Сгенерируйте SSH-ключ для деплоя на своей машине:**

```bash
ssh-keygen -t ed25519 -f ~/.ssh/web-cd-agency-deploy -C "github-actions-deploy" -N ""
```

**2. Положите публичный ключ на VPS:**

```bash
# С локальной машины
ssh-copy-id -i ~/.ssh/web-cd-agency-deploy.pub root@cd-agency.ru
# Или вручную: добавьте содержимое .pub в /root/.ssh/authorized_keys на сервере
```

**3. Добавьте приватный ключ в GitHub Secrets** репозитория `sereganikitin/web`:

- Перейдите в `Settings → Secrets and variables → Actions → New repository secret`.
- Name: `SSH_PRIVATE_KEY`
- Value: содержимое файла `~/.ssh/web-cd-agency-deploy` (приватный, без `.pub`).

Также можете удалить локальную копию приватного ключа после добавления в Secrets, если не планируете подключаться к VPS этим ключом.

**4. Проверьте:** запушьте любой коммит в `main` — должна запуститься Action `Deploy`. Логи: `Actions` → последний run.

Можно также запускать деплой вручную: `Actions → Deploy → Run workflow`.

### Обновление после первоначальной настройки

После шагов выше всё автоматически:

```bash
git push origin main
# → GitHub Action → SSH на VPS → git pull → npm ci → build → pm2 restart
```

Если по какой-то причине нужно вручную развернуть на сервере:

```bash
ssh root@cd-agency.ru "cd /var/www/web.cd-agency.ru && git pull && ./scripts/deploy.sh"
```

## Бэкап

Файлы для бэкапа:
- `data/site.db` (вместе с `site.db-wal` если есть)
- `public/uploads/` (загруженные изображения)
- `.env` (хранить отдельно)

Простой бэкап по cron:
```bash
0 3 * * * tar czf /backups/web-$(date +\%F).tgz -C /var/www/web.cd-agency.ru data public/uploads
```

## Замечания

- `node:sqlite` помечен как experimental в Node 22, стабилен с 23+. На VPS под Node 22 при запуске будет показано предупреждение в логах — это нормально.
- Изображения автоматически конвертируются в webp (макс. ширина 2400px, качество 85). SVG сохраняются как есть.
- Все пути к загруженным файлам — `/uploads/<filename>`, отдаются Next.js напрямую из `public/`.
