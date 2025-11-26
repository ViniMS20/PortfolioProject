import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  // Apaga tudo antes de criar (para não duplicar se rodar 2x)
  await prisma.dayHabit.deleteMany();
  await prisma.habitWeekDays.deleteMany();
  await prisma.day.deleteMany();
  await prisma.habit.deleteMany();

  // Cria hábitos
  await Promise.all([
    prisma.habit.create({
      data: {
        title: "Beber 2L de água",
        created_at: new Date("2024-01-01T00:00:00.000z"),
        weekDays: {
          create: [
            { week_day: 1 }, // Segunda
            { week_day: 2 }, // Terça
            { week_day: 3 }, // Quarta
            { week_day: 4 }, // Quinta
            { week_day: 5 }, // Sexta
          ],
        },
      },
    }),
    prisma.habit.create({
      data: {
        title: "Exercitar (Academia)",
        created_at: new Date("2024-01-01T00:00:00.000z"),
        weekDays: {
          create: [
            { week_day: 1 }, // Segunda
            { week_day: 3 }, // Quarta
            { week_day: 5 }, // Sexta
          ],
        },
      },
    }),
    prisma.habit.create({
      data: {
        title: "Dormir 8h",
        created_at: new Date("2024-01-01T00:00:00.000z"),
        weekDays: {
          create: [
            { week_day: 0 }, // Domingo
            { week_day: 1 },
            { week_day: 2 },
            { week_day: 3 },
            { week_day: 4 },
            { week_day: 5 },
            { week_day: 6 },
          ],
        },
      },
    }),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
