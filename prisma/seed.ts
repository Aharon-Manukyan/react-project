import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

const projects = [
  {
    slug: "fika-eatery2",
    title: "Fika Eatery",
    summary:
      "Fika Eatery is all about great food, a cozy atmosphere, and a sense of community. With a focus on handcrafted flavors, it offers a modern yet welcoming space where brunch, desserts, and fresh daily bakes come together. ",
    description:
      "For the main logo, we chose a serif typeface that highlights the brand’s premium feel and evokes the essence of classic French cuisine, reminiscent of traditional bakery signs. For the secondary logo, we incorporated negative space between the letters to subtly form the outline of a cat’s face—an important symbol of the brand",
    stack: "Next.js,TypeScript,Prisma,SQLite,Zod",
    status: "shipped",
    year: 2025,
    repoUrl: "https://www.behance.net/gallery/218792373/Fika-Eatery-branding",
    liveUrl: "https://www.instagram.com/fika_eatery/",
    featured: true,
    coverTone: "ember",
  },
  {
    slug: "brand-designer-api",
    title: "Brand Designer API",
    summary:
      "Публичный JSON API портфолио: проекты, статусы и заявки с формы контакта.",
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
    summary:
      "Админка студии: статистика, входящие сообщения и редактор кейсов.",
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
    summary:
      "Концепт заметок для исследователей: теги, поиск и светлая типографика.",
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
      company: "Brand Designer",
      body: "Интересен full-stack стек Brand Designer. Можно созвониться на следующей неделе?",
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
