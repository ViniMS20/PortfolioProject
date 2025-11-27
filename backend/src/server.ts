import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const app = Fastify();
const prisma = new PrismaClient();

app.register(cors, {
  origin: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD", "OPTIONS"],
});

app.post("/habits", async (request) => {
  const { title, weekDays } = request.body as {
    title: string;
    weekDays: number[];
  };

  const habit = await prisma.habit.create({
    data: {
      title,
      created_at: new Date(),
      weekDays: {
        create: weekDays.map((weekDay) => {
          return { week_day: weekDay };
        }),
      },
    },
  });

  return habit;
});

/**
 * Rota 2: Listar Hábitos (Com Contagem/Streak)
 */
app.get("/day", async (request) => {
  const { date } = request.query as { date: string };

  const parsedDate = new Date(date);
  const weekDay = parsedDate.getDay();

  // Busca todos os hábitos possíveis no dia da semana
  const possibleHabits = await prisma.habit.findMany({
    where: {
      weekDays: {
        some: {
          week_day: weekDay,
        },
      },
    },
    include: {
      // Conta quantas vezes esse hábito foi completado na história
      _count: {
        select: {
          dayHabits: true,
        },
      },
    },
  });

  // Busca quais já foram marcados hoje
  const day = await prisma.day.findUnique({
    where: {
      date: parsedDate,
    },
    include: {
      dayHabits: true,
    },
  });

  const completedHabits =
    day?.dayHabits.map((dayHabit) => dayHabit.habit_id) ?? [];

  return {
    possibleHabits,
    completedHabits,
  };
});

/**
 * Rota 3: Marcar/Desmarcar (Check)
 */
app.patch("/habits/:id/toggle", async (request) => {
  const { id } = request.params as { id: string };

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  let day = await prisma.day.findUnique({
    where: {
      date: today,
    },
  });

  if (!day) {
    day = await prisma.day.create({
      data: {
        date: today,
      },
    });
  }

  const dayHabit = await prisma.dayHabit.findUnique({
    where: {
      day_id_habit_id: {
        day_id: day.id,
        habit_id: id,
      },
    },
  });

  if (dayHabit) {
    await prisma.dayHabit.delete({
      where: {
        id: dayHabit.id,
      },
    });
  } else {
    await prisma.dayHabit.create({
      data: {
        day_id: day.id,
        habit_id: id,
      },
    });
  }
});

/**
 * Rota 4: Deletar Hábito
 */
app.delete("/habits/:id", async (request) => {
  const { id } = request.params as { id: string };

  // 1. Apaga histórico de conclusões desse hábito
  await prisma.dayHabit.deleteMany({
    where: { habit_id: id },
  });

  // 2. Apaga a configuração de dias da semana
  await prisma.habitWeekDays.deleteMany({
    where: { habit_id: id },
  });

  // 3. Apaga o hábito em si
  await prisma.habit.delete({
    where: { id },
  });

  return { message: "Hábito deletado!" };
});

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("server running on port 3333");
  });
