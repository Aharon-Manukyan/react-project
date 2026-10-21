import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    slug: "pulse-board",
    title: "Pulse Board",
    summary: "Канбан для продуктовых команд: статусы, фильтры и живые метрики спринта.",
    description:
      "Full-stack доска задач с REST API, фильтрами по статусу и ролью администратора. Данные живут в SQLite через Prisma, интерфейс собран на Next.js App Router. Проект показывает CRUD, валидацию Zod и работу с сессиями.",
    stack: "Next.js,TypeScript,Prisma,SQLite,Zod",
    status: "shipped",
    year: 2026,
    repoUrl: "https://github.com/Aharon-Manukyan/react-project",
    liveUrl: null,
    featured: true,
    coverTone: "ember",
  },
  {
    slug: "atelier-api",
    title: "Atelier API",
    summary: "Публичный JSON API портфолио: проекты, статусы и заявки с формы контакта.",
    description:
      "Серверная часть на Route Handlers. GET отдаёт опубликованные кейсы, POST принимает заявки и пишет их в базу. Админские маршруты защищены httpOnly cookie и HMAC-подписью.",
    stack: "Next.js,Route Handlers,Prisma,Zod",
    status: "shipped",
    year: 2026,
    repoUrl: "https://github.com/Aharon-Manukyan/react-project",
    liveUrl: "/api/projects",
    featured: true,
    coverTone: "sage",
  },
  {
    slug: "studio-os",
    title: "Studio OS",
    summary: "Админка студии: статистика, входящие сообщения и редактор кейсов.",
    description:
      "Закрытый кабинет для управления портфолио. Можно добавлять проекты, менять статус, отмечать заявки прочитанными. Это демонстрация auth-потока без стороннего провайдера.",
    stack: "React,Server Components,Cookies,SQLite",
    status: "in-progress",
    year: 2026,
    repoUrl: null,
    liveUrl: "/admin",
    featured: true,
    coverTone: "ink",
  },
  {
    slug: "north-notes",
    title: "North Notes",
    summary: "Концепт заметок для исследователей: теги, поиск и светлая типографика.",
    description:
      "Концепт продукта в портфолио. Показывает, как описывать early-stage идеи: цель, стек, ограничения. Можно превратить в отдельный репозиторий.",
    stack: "Next.js,Tailwind CSS",
    status: "concept",
    year: 2025,
    repoUrl: null,
    liveUrl: null,
    featured: false,
    coverTone: "sand",
  },
];

async function main() {
  await prisma.message.deleteMany();
  await prisma.project.deleteMany();
  await prisma.project.createMany({ data: projects });
  await prisma.message.create({
    data: {
      name: "Мария Соколова",
      email: "maria@example.com",
      company: "North Labs",
      body: "Интересен full-stack стек Atelier. Можно созвониться на следующей неделе?",
    },
  });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });
