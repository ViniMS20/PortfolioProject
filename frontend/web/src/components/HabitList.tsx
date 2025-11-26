import { useEffect, useState } from "react";
import { Check } from "phosphor-react";
import { api } from "../lib";
import clsx from "clsx";

interface HabitsInfo {
  possibleHabits: {
    id: string;
    title: string;
    created_at: string;
  }[];
  completedHabits: string[];
}

export function HabitList() {
  const [habitsInfo, setHabitsInfo] = useState<HabitsInfo>();

  useEffect(() => {
    api
      .get("day", {
        params: {
          date: new Date().toISOString(),
        },
      })
      .then((response) => {
        setHabitsInfo(response.data);
      });
  }, []);

  async function handleToggleHabit(habitId: string) {
    const isHabitAlreadyCompleted =
      habitsInfo!.completedHabits.includes(habitId);

    let completedHabits: string[] = [];

    if (isHabitAlreadyCompleted) {
      completedHabits = habitsInfo!.completedHabits.filter(
        (id) => id !== habitId
      );
    } else {
      completedHabits = [...habitsInfo!.completedHabits, habitId];
    }

    setHabitsInfo({
      possibleHabits: habitsInfo!.possibleHabits,
      completedHabits,
    });

    await api.patch(`/habits/${habitId}/toggle`);
  }

  return (
    <div className="mt-6 flex flex-col gap-3">
      {habitsInfo?.possibleHabits.map((habit) => {
        const isHabitCompleted = habitsInfo.completedHabits.includes(habit.id);

        return (
          <div
            key={habit.id}
            onClick={() => handleToggleHabit(habit.id)}
            className="flex items-center gap-3 group cursor-pointer"
          >
            <div
              className={clsx(
                "h-8 w-8 rounded-lg flex items-center justify-center border-2 transition-colors",
                {
                  "bg-green-500 border-green-500": isHabitCompleted,
                  "bg-zinc-900 border-zinc-800 group-hover:border-violet-500":
                    !isHabitCompleted,
                }
              )}
            >
              {isHabitCompleted && <Check size={20} className="text-white" />}
            </div>

            <span
              className={clsx(
                "text-xl font-semibold leading-tight group-hover:text-violet-300 transition-colors",
                {
                  "line-through text-zinc-400": isHabitCompleted,
                  "text-white": !isHabitCompleted,
                }
              )}
            >
              {habit.title}
            </span>
          </div>
        );
      })}
    </div>
  );
}
