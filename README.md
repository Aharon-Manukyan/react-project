# Brand-Designer

Full-stack портфолио на **Next.js 16**, **React 19**, **Prisma** и **SQLite**.

Публичная витрина кейсов, JSON API, форма заявок и админка с cookie-сессией.

## Запуск

```bash
npm install
npx prisma migrate dev --name init
npx prisma db seed
npm run dev
```

Откройте [http://localhost:3000](http://localhost:3000).

- Админка: `/admin/login`
- Демо-пароль: `brand-designer-admin`
- API проектов: `/api/projects`

## Стек

- App Router, Server Components, Route Handlers
- Zod для валидации
- Prisma + SQLite
- Tailwind CSS
