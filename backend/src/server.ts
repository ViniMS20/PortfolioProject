import Fastify from "fastify";
import cors from "@fastify/cors";
import { PrismaClient } from "@prisma/client";

const app = Fastify();
const prisma = new PrismaClient();

app.register(cors);

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

app.get("/day", async (request) => {
  const { date } = request.query as { date: string };

  const parsedDate = new Date(date);
  const weekDay = parsedDate.getDay();

  const possibleHabits = await prisma.habit.findMany({
    where: {
      weekDays: {
        some: {
          week_day: weekDay,
        },
      },
    },
  });

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

app
  .listen({
    port: 3333,
  })
  .then(() => {
    console.log("Server running on port 3333 🚀");
  });
